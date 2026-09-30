import db from '../../db/index.js';
import { ensureAdmin, getOrCreateUserFromTelegram, addBalance, deductBalance, listProviders, listApps, listChannels, listPrices, getRecentOrders } from './start.js';

export async function handleAdminAction(ctx, action, args) {
  if (!ensureAdmin(ctx)) {
    return ctx.reply('⛔️ - ليس لديك صلاحية الوصول إلى لوحة الإدارة.');
  }

  switch (action) {
    case 'admin_add_provider': {
      return ctx.reply('🧩 - أرسل: `addprovider <name> <code>`', { parse_mode: 'Markdown' });
    }
    case 'admin_add_app': {
      return ctx.reply('📱 - أرسل: `addapp <providerCode> <appCode> <name>`', { parse_mode: 'Markdown' });
    }
    case 'admin_add_channel': {
      return ctx.reply('📢 - أرسل: `addchannel <name> <type>`', { parse_mode: 'Markdown' });
    }
    case 'admin_add_price': {
      return ctx.reply('💰 - أرسل: `addprice <providerCode> <appCode> <countryCode> <operator> <price>`', { parse_mode: 'Markdown' });
    }
    case 'admin_add_coin': {
      return ctx.reply('➕ - أرسل: `addcoin <telegramId> <amount>`', { parse_mode: 'Markdown' });
    }
    case 'admin_dec_coin': {
      return ctx.reply('📛 - أرسل: `delcoin <telegramId> <amount>`', { parse_mode: 'Markdown' });
    }
    case 'admin_list_providers': {
      const rows = listProviders();
      const text = rows.length ? rows.map((row) => `• ${row.name} (${row.code})`).join('\n') : 'لا توجد مزودات حالياً.';
      return ctx.reply(text);
    }
    case 'admin_list_apps': {
      const rows = listApps();
      const text = rows.length ? rows.map((row) => `• ${row.name} (${row.code})`).join('\n') : 'لا توجد تطبيقات.';
      return ctx.reply(text);
    }
    case 'admin_list_channels': {
      const rows = listChannels();
      const text = rows.length ? rows.map((row) => `• ${row.name} (${row.type})`).join('\n') : 'لا توجد قنوات.';
      return ctx.reply(text);
    }
    case 'admin_list_prices': {
      const rows = listPrices();
      const text = rows.length ? rows.map((row) => `• ${row.provider_name} / ${row.app_name} / ${row.country_code} / ${row.operator} = ${row.price}`).join('\n') : 'لا توجد أسعار.';
      return ctx.reply(text);
    }
    case 'admin_stats': {
      const usersCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
      const providersCount = db.prepare('SELECT COUNT(*) AS c FROM providers').get().c;
      const totalBalance = db.prepare('SELECT COALESCE(SUM(balance), 0) AS total FROM users').get().total;
      const recentOrders = getRecentOrders(5);
      const text = `📊 - إحصائيات الإدارة:\n\nالمستخدمون: *${usersCount}*\nالمزودين: *${providersCount}*\nإجمالي الرصيد: *${Number(totalBalance).toFixed(2)}*\n\nآخر الطلبات:\n${recentOrders.map((o) => `#${o.id} ${o.status}`).join('\n') || 'لا توجد طلبات.'}`;
      return ctx.reply(text, { parse_mode: 'Markdown' });
    }
    default:
      return ctx.reply('⚠️ - أمر الإدارة غير معروف.');
  }
}

export async function executeAdminCommand(ctx, text) {
  if (!ensureAdmin(ctx)) {
    return ctx.reply('⛔️ - ليس لديك صلاحية الإدارة.');
  }

  const parts = text.trim().split(/\s+/);
  const command = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  if (!command) return ctx.reply('❌ - لا يوجد أمر.');

  if (command === 'addprovider') {
    const [name, code] = args;
    if (!name || !code) return ctx.reply('صيغة: `addprovider <name> <code>`', { parse_mode: 'Markdown' });
    const exists = db.prepare('SELECT id FROM providers WHERE code = ?').get(code);
    if (exists) return ctx.reply('هذا المزود موجود مسبقًا.' );
    db.prepare('INSERT INTO providers (name, code, enabled) VALUES (?, ?, 1)').run(name, code);
    return ctx.reply(`✅ - تم إضافة المزود: ${name} (${code})`);
  }

  if (command === 'addapp') {
    const [providerCode, appCode, appName] = args;
    if (!providerCode || !appCode || !appName) return ctx.reply('صيغة: `addapp <providerCode> <appCode> <name>`', { parse_mode: 'Markdown' });
    const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
    if (!provider) return ctx.reply('المزود غير موجود.');
    db.prepare('INSERT INTO apps (provider_id, code, name, enabled) VALUES (?, ?, ?, 1)').run(provider.id, appCode, appName);
    return ctx.reply(`✅ - تم إضافة التطبيق: ${appName} (${appCode})`);
  }

  if (command === 'addchannel') {
    const [name, type = 'telegram'] = args;
    if (!name) return ctx.reply('صيغة: `addchannel <name> <type>`', { parse_mode: 'Markdown' });
    db.prepare('INSERT INTO channels (name, type, enabled) VALUES (?, ?, 1)').run(name, type);
    return ctx.reply(`✅ - تم إضافة القناة: ${name} (${type})`);
  }

  if (command === 'addprice') {
    const [providerCode, appCode, countryCode, operator, priceRaw] = args;
    if (!providerCode || !appCode || !countryCode || !priceRaw) return ctx.reply('صيغة: `addprice <providerCode> <appCode> <countryCode> <operator> <price>`', { parse_mode: 'Markdown' });
    const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
    const app = db.prepare('SELECT id FROM apps WHERE provider_id = ? AND code = ?').get(provider?.id, appCode);
    if (!provider || !app) return ctx.reply('المزود أو التطبيق غير موجود.');
    const price = Number(priceRaw);
    db.prepare('INSERT INTO prices (provider_id, app_id, country_code, operator, price, enabled) VALUES (?, ?, ?, ?, ?, 1)').run(provider.id, app.id, countryCode, operator || 'any', isNaN(price) ? 0 : price);
    return ctx.reply(`✅ - تم إضافة السعر: ${providerCode}/${appCode}/${countryCode}/${operator || 'any'} = ${price}`);
  }

  if (command === 'addcoin') {
    const [telegramId, amountRaw] = args;
    if (!telegramId || !amountRaw) return ctx.reply('صيغة: `addcoin <telegramId> <amount>`', { parse_mode: 'Markdown' });
    const result = addBalance(telegramId, Number(amountRaw));
    if (result === null) return ctx.reply('المستخدم غير موجود.');
    return ctx.reply(`✅ - تم إضافة ${amountRaw} إلى رصيد المستخدم ${telegramId}. الرصيد الحالي: ${result}`);
  }

  if (command === 'delcoin') {
    const [telegramId, amountRaw] = args;
    if (!telegramId || !amountRaw) return ctx.reply('صيغة: `delcoin <telegramId> <amount>`', { parse_mode: 'Markdown' });
    const result = deductBalance(telegramId, Number(amountRaw));
    if (result === null) return ctx.reply('المستخدم غير موجود.');
    return ctx.reply(`✅ - تم خصم ${amountRaw} من رصيد المستخدم ${telegramId}. الرصيد الحالي: ${result}`);
  }

  if (command === 'stats') {
    const usersCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
    const ordersCount = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
    const providersCount = db.prepare('SELECT COUNT(*) AS c FROM providers').get().c;
    const totalBalance = db.prepare('SELECT COALESCE(SUM(balance), 0) AS total FROM users').get().total;
    return ctx.reply(`📊 - إحصائيات البوت\n\nالمستخدمين: *${usersCount}*\nالطلبات: *${ordersCount}*\nالمزودين: *${providersCount}*\nإجمالي الرصيد: *${Number(totalBalance).toFixed(2)}*`, { parse_mode: 'Markdown' });
  }

  return ctx.reply('❌ - أمر الإدارة غير صالح.');
}
