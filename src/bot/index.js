import { Telegraf } from 'telegraf';
import { config } from '../config.js';
import db from '../db/index.js';
import { mainKeyboard, adminKeyboard } from './keyboards.js';
import {
  handleStart,
  handleStats,
  handleTerms,
  handleLogin,
  handleSignup,
  handleAdmin,
  handleBalance,
  handleOrders,
  ensureAdmin,
  getOrCreateUserFromTelegram,
} from './commands/start.js';
import { handleAdminAction, executeAdminCommand } from './commands/admin.js';
import { createOrder } from '../services/orders.js';
import { getProviders, getAppsByProvider, getCountryList, getPriceFor } from '../services/providerRegistry.js';

export function startBot() {
  if (!config.BOT_TOKEN) {
    console.warn('⚠️ BOT_TOKEN غير مضبوط. لن يبدأ البوت.');
    return null;
  }

  const bot = new Telegraf(config.BOT_TOKEN);

  bot.start(async (ctx) => {
    await handleStart(ctx);
  });

  bot.command('start', async (ctx) => {
    await handleStart(ctx);
  });

  bot.command('stats', async (ctx) => {
    await handleStats(ctx);
  });

  bot.command('admin', async (ctx) => {
    await handleAdmin(ctx);
  });

  bot.command('balance', async (ctx) => {
    await handleBalance(ctx);
  });

  bot.command('orders', async (ctx) => {
    await handleOrders(ctx);
  });

  bot.action('startup', async (ctx) => {
    await handleStart(ctx);
  });

  bot.action('buy', async (ctx) => {
    const providers = getProviders();
    const keyboard = {
      inline_keyboard: providers.map((provider) => [{ text: provider.name, callback_data: `buy_provider:${provider.code}` }])
    };
    return ctx.reply('💰 - اختر المزود', { reply_markup: keyboard });
  });

  bot.action(/^buy_provider:(.+)$/, async (ctx) => {
    const providerCode = ctx.match[1];
    const apps = getAppsByProvider(providerCode);
    if (!apps.length) {
      return ctx.reply('⚠️ - لا توجد تطبيقات لهذا المزود.');
    }

    const keyboard = {
      inline_keyboard: apps
        .map((app) => [{ text: app.name, callback_data: `buy_app:${providerCode}:${app.code}` }])
        .concat([[{ text: 'رجوع 🔙', callback_data: 'startup' }]])
    };

    return ctx.editMessageText('📱 - اختر التطبيق', { reply_markup: keyboard });
  });

  bot.action(/^buy_app:([^:]+):([^:]+)$/, async (ctx) => {
    const [, providerCode, appCode] = ctx.match;
    const countries = getCountryList();
    const keyboard = {
      inline_keyboard: countries
        .map((country) => [{ text: `${country.name} (${country.code})`, callback_data: `buy_country:${providerCode}:${appCode}:${country.code}` }])
        .concat([[{ text: 'رجوع 🔙', callback_data: 'startup' }]])
    };
    return ctx.editMessageText('🌍 - اختر الدولة', { reply_markup: keyboard });
  });

  bot.action(/^buy_country:([^:]+):([^:]+):([^:]+)$/, async (ctx) => {
    const [, providerCode, appCode, countryCode] = ctx.match;
    const price = getPriceFor(providerCode, appCode, countryCode, 'any');
    const text = `سعر الخدمة: ${price !== null ? `${price} روبل` : 'غير متوفر'}\n\n✅ - هل تريد المتابعة؟`;
    const keyboard = {
      inline_keyboard: [
        [{ text: 'تأكيد الشراء ✅', callback_data: `buy_confirm:${providerCode}:${appCode}:${countryCode}:any` }],
        [{ text: 'إلغاء ❌', callback_data: 'startup' }]
      ]
    };
    return ctx.editMessageText(text, { reply_markup: keyboard });
  });

  bot.action(/^buy_confirm:([^:]+):([^:]+):([^:]+):(.+)$/, async (ctx) => {
    const [, providerCode, appCode, countryCode, operator] = ctx.match;
    const telegramId = String(ctx.from.id);

    try {
      const result = await createOrder({ telegramId, providerCode, appCode, countryCode, operator });
      return ctx.editMessageText(`✅ - تم إنشاء الطلب بنجاح.\nرقم الطلب: *${result.orderId}*\nرقم الهاتف: *${result.external.number}*`, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      return ctx.editMessageText(`❌ - فشل إنشاء الطلب: ${error.message || error.toString()}`);
    }
  });

  bot.action('login', async (ctx) => {
    await handleLogin(ctx);
  });

  bot.action('terms', async (ctx) => {
    await handleTerms(ctx);
  });

  bot.action('stats', async (ctx) => {
    await handleStats(ctx);
  });

  bot.action('balance', async (ctx) => {
    await handleBalance(ctx);
  });

  bot.action('orders', async (ctx) => {
    await handleOrders(ctx);
  });

  bot.action('admin', async (ctx) => {
    await handleAdmin(ctx);
  });

  bot.action(/^admin_list_(.+)$/, async (ctx) => {
    await handleAdminAction(ctx, ctx.match[0]);
  });

  bot.action(/^admin_help_(.+)$/, async (ctx) => {
    await handleAdminAction(ctx, ctx.match[0]);
  });

  bot.action(/^admin_stats$/, async (ctx) => {
    await handleAdminAction(ctx, 'admin_stats');
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const lower = text.toLowerCase();

    if (lower.startsWith('addprovider ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addserver ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addapp ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addcountry ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addprice ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addchannel ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addcoin ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('delcoin ')) {
      await executeAdminCommand(ctx, text);
      return;
    }

    if (lower === 'stats') {
      await handleStats(ctx);
      return;
    }

    if (lower === 'balance') {
      await handleBalance(ctx);
      return;
    }

    if (lower === 'orders') {
      await handleOrders(ctx);
      return;
    }

    const user = getOrCreateUserFromTelegram(ctx.from);
    if (!user) {
      await ctx.reply('حدث خطأ أثناء إنشاء المستخدم.');
      return;
    }

    await ctx.reply(`👤 - مستخدمك: *${user.username || user.telegram_id}*\n💰 - الرصيد: *${Number(user.balance || 0).toFixed(2)}*`, {
      parse_mode: 'Markdown',
      reply_markup: mainKeyboard()
    });
  });

  console.log('Telegram bot started.');
  bot.launch();
  return bot;
}
