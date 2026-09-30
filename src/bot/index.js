import { Telegraf } from 'telegraf';
import { config } from '../config.js';
import db from '../db/index.js';
import { mainKeyboard, adminKeyboard } from './keyboards.js';
import { handleStart, handleStats, handleTerms, handleLogin, handleSignup, handleAdmin } from './commands/start.js';
import { executeAdminCommand } from './commands/admin.js';
import { getOrCreateUserFromTelegram } from './commands/start.js';
import { getProviders } from '../services/providerRegistry.js';
import { startBuy, providerSelected, appSelected, countrySelected, confirmBuy } from './commands/buy.js';

export function startBot() {
  if (!config.BOT_TOKEN) {
    console.warn('BOT_TOKEN is not set. Bot will not start.');
    return null;
  }

  const bot = new Telegraf(config.BOT_TOKEN);

  bot.start(async (ctx) => {
    await handleStart(ctx);
  });

  bot.command('admin', async (ctx) => {
    await handleAdmin(ctx);
  });

  bot.command('stats', async (ctx) => {
    await handleStats(ctx);
  });

  bot.command('buy', async (ctx) => {
    await startBuy(ctx);
  });

  bot.action('startup', async (ctx) => {
    await handleStart(ctx);
  });

  bot.action('login', async (ctx) => {
    await handleLogin(ctx);
  });

  bot.action('signup', async (ctx) => {
    await handleSignup(ctx);
  });

  bot.action('terms', async (ctx) => {
    await handleTerms(ctx);
  });

  bot.action('stats', async (ctx) => {
    await handleStats(ctx);
  });

  bot.action('admin', async (ctx) => {
    await handleAdmin(ctx);
  });

  bot.action(/^admin_(.+)$/, async (ctx) => {
    const action = ctx.match[1];
    const adminActions = {
      add_provider: 'admin_add_provider',
      list_providers: 'admin_list_providers',
      add_app: 'admin_add_app',
      list_apps: 'admin_list_apps',
      add_channel: 'admin_add_channel',
      list_channels: 'admin_list_channels',
      add_price: 'admin_add_price',
      list_prices: 'admin_list_prices',
      add_coin: 'admin_add_coin',
      dec_coin: 'admin_dec_coin',
      stats: 'admin_stats',
    };
    const realAction = adminActions[action] || action;
    return ctx.reply(`⚠️ - تم تحديد الإدارة: ${realAction}. استخدم الأوامر النصية في لوحة الإدارة.`);
  });

  bot.action(/^buy_provider:(.+)$/, async (ctx) => {
    const providerCode = ctx.match[1];
    await providerSelected(ctx, providerCode);
  });

  bot.action(/^buy_app:([^:]+):([^:]+)$/, async (ctx) => {
    const [, providerCode, appCode] = ctx.match;
    await appSelected(ctx, providerCode, appCode);
  });

  bot.action(/^buy_country:([^:]+):([^:]+):([^:]+)$/, async (ctx) => {
    const [, providerCode, appCode, countryCode] = ctx.match;
    await countrySelected(ctx, providerCode, appCode, countryCode);
  });

  bot.action(/^buy_confirm:([^:]+):([^:]+):([^:]+):(.+)$/, async (ctx) => {
    const [, providerCode, appCode, countryCode, operator] = ctx.match;
    await confirmBuy(ctx, providerCode, appCode, countryCode, operator || 'any');
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();
    const lower = text.toLowerCase();

    if (lower.startsWith('addprovider ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addapp ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addchannel ')) {
      await executeAdminCommand(ctx, text);
      return;
    }
    if (lower.startsWith('addprice ')) {
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
    if (lower.startsWith('stats')) {
      await handleStats(ctx);
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
