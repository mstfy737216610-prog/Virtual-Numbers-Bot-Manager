import ProviderAdapter from './services/adapters/base.js';
import FiveSimAdapter from './services/adapters/fivesim.js';
import TempNumAdapter from './services/adapters/tempnum.js';
import OnlineSimAdapter from './services/adapters/onlinesim.js';
import { getProviders, getAppsByProvider, getPriceFor } from './services/providerRegistry.js';
import db from './db/index.js';

const adapters = new Map();

function getAdapterByProviderCode(code) {
  // For now map '5sim' -> FiveSimAdapter, 'tempnum' -> TempNumAdapter, 'onlinesim' -> OnlineSimAdapter, else demo
  const mapping = {
    '5sim': FiveSimAdapter,
    'tempnum': TempNumAdapter,
    'onlinesim': OnlineSimAdapter,
    'demo': null
  };
  const Cls = mapping[code] || null;
  return Cls;
}

export async function createOrder({ telegramId, providerCode, appCode, countryCode, operator = 'any' }) {
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
  if (!user) throw new Error('User not found');

  const provider = db.prepare('SELECT * FROM providers WHERE code = ? AND enabled = 1').get(providerCode);
  if (!provider) throw new Error('Provider not found');

  const app = db.prepare('SELECT * FROM apps WHERE provider_id = ? AND code = ? AND enabled = 1').get(provider.id, appCode);
  if (!app) throw new Error('App not found');

  const price = getPriceFor(providerCode, appCode, countryCode, operator);
  if (price === null) throw new Error('Price not found for selection');
  if (Number(user.balance) < Number(price)) throw new Error('Insufficient balance');

  // Deduct balance immediately
  const newBalance = Number(user.balance) - Number(price);
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
  db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)').run(user.id, 'purchase', Number(price), 'pending', JSON.stringify({ provider: providerCode }));

  const insert = db.prepare('INSERT INTO orders (user_id, provider_id, app_id, country_code, operator, status) VALUES (?, ?, ?, ?, ?, ?)');
  const info = insert.run(user.id, provider.id, app.id, countryCode, operator || 'any', 'creating');
  const orderId = info.lastInsertRowid;

  // Select adapter class
  const AdapterCls = getAdapterByProviderCode(providerCode);

  let external = null;
  try {
    if (AdapterCls) {
      const server = db.prepare('SELECT * FROM provider_servers WHERE provider_id = ? AND enabled = 1 ORDER BY id DESC LIMIT 1').get(provider.id);
      const adapter = new AdapterCls(server || {});
      const res = await adapter.getNumber({ app: appCode, country: countryCode, operator });
      external = res;
      // update order
      db.prepare('UPDATE orders SET phone = ?, external_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(res.number || '', res.idnumber || '', res.status === 200 ? 'active' : 'failed', orderId);
    } else {
      // demo fallback
      const res = {
        status: 200,
        message: 'Number fetched successfully',
        number: `+${countryCode.toUpperCase()}-000000000`,
        idnumber: `demo-${appCode}-${Date.now()}`,
        time: 60 * 15,
        location: providerCode
      };
      db.prepare('UPDATE orders SET phone = ?, external_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(res.number, res.idnumber, 'active', orderId);
      external = res;
    }
  } catch (e) {
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('failed', orderId);
    // Refund user partially or fully depending on policy; for now refund
    db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(Number(price), user.id);
    db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)').run(user.id, 'refund', Number(price), 'success', JSON.stringify({ order: orderId }));
    throw e;
  }

  return { orderId, external };
}

export async function pollOrderStatus(orderId) {
  const order = db.prepare('SELECT o.*, p.code as provider_code, a.code as app_code FROM orders o LEFT JOIN providers p ON p.id = o.provider_id LEFT JOIN apps a ON a.id = o.app_id WHERE o.id = ?').get(orderId);
  if (!order) throw new Error('Order not found');
  const AdapterCls = getAdapterByProviderCode(order.provider_code);
  if (!AdapterCls) return null;
  const server = db.prepare('SELECT * FROM provider_servers WHERE provider_id = ? AND enabled = 1 ORDER BY id DESC LIMIT 1').get(order.provider_id);
  const adapter = new AdapterCls(server || {});
  const status = await adapter.getStatus({ idnumber: order.external_id, number: order.phone });
  // status should return { status: 200/0, code }
  if (status && status.status == 200) {
    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('completed', orderId);
    db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)').run(order.user_id, 'complete', 0, 'success', JSON.stringify({ order: orderId }));
    return status;
  }
  return status;
}
