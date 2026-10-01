import db from '../../db/index.js';
import { ensureAdmin, addBalance, deductBalance, listProviders, listApps, listServers, listChannels, listCountries, listPrices, getRecentOrders } from './start.js';
import { adminKeyboard } from '../keyboards.js';

const help = {
  admin_help_provider: 'addprovider <اسم> <كود>',
  admin_help_server: 'addserver <كود_المزود> <الاسم> <base_url> <api_key>',
  admin_help_app: 'addapp <كود_المزود> <كود_التطبيق> <اسم>',
  admin_help_country: 'addcountry <كود> <اسم>',
  admin_help_price: 'addprice <كود_المزود> <كود_التطبيق> <كود_الدولة> <المشغل> <السعر>',
  admin_help_channel: 'addchannel <اسم> <نوع>',
  admin_help_addcoin: 'addcoin <telegram_id> <المبلغ>',
  admin_help_delcoin: 'delcoin <telegram_id> <المبلغ>'
};

function lines(rows, formatter, emptyText) {
  return rows.length ? rows.map(formatter).join('\n') : emptyText;
}

export async function handleAdminAction(ctx, action) {
  if (!ensureAdmin(ctx)) return ctx.reply('⛔️ - لا تملك صلاحية الإدارة.');
  await ctx.answerCbQuery().catch(() => {});

  if (help[action]) {
    return ctx.reply(`📝 - الصيغة المطلوبة:\n\`${help[action]}\``, {
      parse_mode: 'Markdown',
      reply_markup: adminKeyboard()
    });
  }

  let text = '';

  if (action === 'admin_list_providers') {
    text = lines(listProviders(), (r) => `• ${r.name} (${r.code}) ${r.enabled ? '✅' : '❌'}`, 'لا توجد مزودات.');
  } else if (action === 'admin_list_servers') {
    text = lines(listServers(), (r) => `• ${r.provider_code} / ${r.name} / ${r.base_url || '-'} ${r.enabled ? '✅' : '❌'}`, 'لا توجد سيرفرات.');
  } else if (action === 'admin_list_apps') {
    text = lines(listApps(), (r) => `• ${r.provider_code} / ${r.provider_name} (${r.code})`, 'لا توجد تطبيقات.');
  } else if (action === 'admin_list_countries') {
    text = lines(listCountries(), (r) => `• ${r.code} - ${r.name}`, 'لا توجد دول.');
  } else if (action === 'admin_list_channels') {
    text = lines(listChannels(), (r) => `• ${r.name} (${r.type}) ${r.enabled ? '✅' : '❌'}`, 'لا توجد قنوات.');
  } else if (action === 'admin_list_prices') {
    text = lines(listPrices(), (r) => `• ${r.provider_code}/${r.app_code}/${r.country_code}/${r.operator || 'any'} = ${r.price}`, 'لا توجد أسعار.');
  } else if (action === 'admin_stats') {
    const users = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
    const orders = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
    const totalBalance = db.prepare('SELECT COALESCE(SUM(balance), 0) AS total FROM users').get().total;
    const recent = getRecentOrders(5).map((r) => `#${r.id} ${r.status}`).join('\n');
    text = `📈 - الإحصائيات\n\n👥 المستخدمون: ${users}\n🧾 الطلبات: ${orders}\n💰 الرصيد الكلي: ${Number(totalBalance).toFixed(2)}\n\n${recent || 'لا توجد طلبات.'}`;
  } else {
    text = 'استخدم لوحة الإدارة أو الأوامر النصية.';
  }

  return ctx.reply(text, {
    reply_markup: adminKeyboard()
  });
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function executeAdminCommand(ctx, input) {
  if (!ensureAdmin(ctx)) return ctx.reply('⛔️ - لا تملك صلاحية الإدارة.');

  const [command, ...args] = input.trim().split(/\s+/);

  try {
    if (command === 'addprovider') {
      const [name, code] = args;
      if (!name || !code) throw new Error('addprovider <اسم> <كود>');
      db.prepare('INSERT INTO providers (name, code, enabled) VALUES (?, ?, 1)').run(name, code);
      return ctx.reply('✅ - تم إضافة المزود.');
    }

    if (command === 'addserver') {
      const [providerCode, name, baseUrl = '', apiKey = ''] = args;
      if (!providerCode || !name) throw new Error('addserver <كود_المزود> <الاسم> <base_url> <api_key>');
      const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
      if (!provider) throw new Error('المزود غير موجود.');
      db.prepare('INSERT INTO provider_servers (provider_id, name, base_url, api_key, enabled) VALUES (?, ?, ?, ?, 1)')
        .run(provider.id, name, baseUrl, apiKey);
      return ctx.reply('✅ - تم إضافة السيرفر.');
    }

    if (command === 'addapp') {
      const [providerCode, appCode, appName] = args;
      if (!providerCode || !appCode || !appName) throw new Error('addapp <كود_المزود> <كود_التطبيق> <اسم>');
      const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
      if (!provider) throw new Error('المزود غير موجود.');
      db.prepare('INSERT INTO apps (provider_id, code, name, enabled) VALUES (?, ?, ?, 1)').run(provider.id, appCode, appName);
      return ctx.reply('✅ - تم إضافة التطبيق.');
    }

    if (command === 'addcountry') {
      const [code, name] = args;
      if (!code || !name) throw new Error('addcountry <كود> <اسم>');
      db.prepare('INSERT INTO countries (code, name) VALUES (?, ?)').run(code, name);
      return ctx.reply('✅ - تم إضافة الدولة.');
    }

    if (command === 'addchannel') {
      const [name, type = 'telegram'] = args;
      if (!name) throw new Error('addchannel <اسم> <نوع>');
      db.prepare('INSERT INTO channels (name, type, enabled) VALUES (?, ?, 1)').run(name, type);
      return ctx.reply('✅ - تم إضافة القناة.');
    }

    if (command === 'addprice') {
      const [providerCode, appCode, countryCode, operator = 'any', priceRaw] = args;
      if (!providerCode || !appCode || !countryCode || !priceRaw) {
        throw new Error('addprice <كود_المزود> <كود_التطبيق> <كود_الدولة> <المشغل> <السعر>');
      }
      const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
      const app = provider ? db.prepare('SELECT id FROM apps WHERE provider_id = ? AND code = ?').get(provider.id, appCode) : null;
      if (!provider || !app) throw new Error('المزود أو التطبيق غير موجود.');
      const price = toNumber(priceRaw);
      if (price === null) throw new Error('السعر غير صالح.');

      db.prepare('INSERT INTO prices (provider_id, app_id, country_code, operator, price, enabled) VALUES (?, ?, ?, ?, ?, 1)')
        .run(provider.id, app.id, countryCode, operator || 'any', price);
      return ctx.reply('✅ - تم إضافة السعر.');
    }

    if (command === 'addcoin') {
      const [telegramId, amountRaw] = args;
      if (!telegramId || !amountRaw) throw new Error('addcoin <telegram_id> <المبلغ>');
      const amount = toNumber(amountRaw);
      if (amount === null) throw new Error('المبلغ غير صالح.');
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
      if (!user) throw new Error('المستخدم غير موجود.');
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, user.id);
      db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)')
        .run(user.id, 'credit', amount, 'success', JSON.stringify({ source: 'admin' }));
      return ctx.reply(`✅ - تم شحن الرصيد. الرصيد الحالي: ${Number(user.balance + amount).toFixed(2)}`);
    }

    if (command === 'delcoin') {
      const [telegramId, amountRaw] = args;
      if (!telegramId || !amountRaw) throw new Error('delcoin <telegram_id> <المبلغ>');
      const amount = toNumber(amountRaw);
      if (amount === null) throw new Error('المبلغ غير صالح.');
      const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
      if (!user) throw new Error('المستخدم غير موجود.');
      if (Number(user.balance) < amount) throw new Error('الرصيد غير كافٍ.');
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, user.id);
      db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)')
        .run(user.id, 'debit', amount, 'success', JSON.stringify({ source: 'admin' }));
      return ctx.reply(`✅ - تم خصم الرصيد. الرصيد الحالي: ${Number(user.balance - amount).toFixed(2)}`);
    }

    return ctx.reply('❌ - الأمر غير معروف.');
  } catch (error) {
    return ctx.reply(`❌ - ${error.message}`);
  }
}
