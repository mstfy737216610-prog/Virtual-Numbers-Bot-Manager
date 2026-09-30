import db from '../../db/index.js';
import { config } from '../../config.js';

export function getOrCreateUserFromTelegram(from) {
  if (!from) return null;
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(from.id));
  if (!user) {
    const email = `${(from.username || 'user').toLowerCase()}@bot.local`;
    const result = db.prepare(`INSERT INTO users (telegram_id, username, email, password_hash, role, balance) VALUES (?, ?, ?, ?, ?, 0)`).run(String(from.id), from.username || '', email, 'demo-password', 'user');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }
  return user;
}

export function getUserBalance(telegramId) {
  const row = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(String(telegramId));
  return Number(row?.balance || 0);
}

export function addBalance(telegramId, amount) {
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
  if (!user) return null;
  const newBalance = Number(user.balance || 0) + Number(amount || 0);
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
  db.prepare(`INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, 'credit', ?, 'success', ?)`).run(user.id, Number(amount || 0), JSON.stringify({ source: 'admin' }));
  return newBalance;
}

export function deductBalance(telegramId, amount) {
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
  if (!user) return null;
  const current = Number(user.balance || 0);
  const safeAmount = Number(amount || 0);
  const newBalance = Math.max(0, current - safeAmount);
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, user.id);
  db.prepare(`INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, 'debit', ?, 'success', ?)`).run(user.id, safeAmount, JSON.stringify({ source: 'admin' }));
  return newBalance;
}

export function ensureAdmin(ctx) {
  const admin = String(config.DEFAULT_ADMIN || '8338869162');
  return String(ctx.from.id) === admin;
}

export function listProviders() {
  return db.prepare('SELECT * FROM providers WHERE enabled = 1 ORDER BY id DESC').all();
}

export function listApps(providerId) {
  if (!providerId) return db.prepare('SELECT * FROM apps WHERE enabled = 1 ORDER BY id DESC').all();
  return db.prepare('SELECT * FROM apps WHERE provider_id = ? AND enabled = 1 ORDER BY id DESC').all(providerId);
}

export function listChannels() {
  return db.prepare('SELECT * FROM channels WHERE enabled = 1 ORDER BY id DESC').all();
}

export function listPrices() {
  return db.prepare(`
    SELECT p.id, p.provider_id, pr.name AS provider_name, p.app_id, a.name AS app_name, p.country_code, p.operator, p.price, p.enabled
    FROM prices p
    LEFT JOIN providers pr ON pr.id = p.provider_id
    LEFT JOIN apps a ON a.id = p.app_id
    ORDER BY p.id DESC
  `).all();
}

export function getRecentOrders(limit = 5) {
  return db.prepare(`
    SELECT o.*, u.username, u.telegram_id
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.id DESC
    LIMIT ?
  `).all(limit);
}
