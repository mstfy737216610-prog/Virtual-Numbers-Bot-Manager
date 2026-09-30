import { Telegraf } from 'telegraf';
import { config } from '../config.js';
import db from '../db/index.js';
import { mainKeyboard, adminKeyboard } from './keyboards.js';
import { handleStart, handleStats, handleTerms, handleLogin, handleSignup, handleAdmin } from './commands/start.js';
import { handleAdminAction, executeAdminCommand } from './commands/admin.js';
import { getOrCreateUserFromTelegram, addBalance, deductBalance } from './commands/start.js';

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
    const rows = db.prepare('SELECT * FROM providers WHERE enabled = 1 ORDER BY id DESC').all();
    const markup = {
      inline_keyboard: rows.map((row) => [{ text: row.name, callback_data: `buy_provider:${row.code}` }])
    };
    await ctx.reply('💰 - اختر المزود', { reply_markup: markup });
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
    await handleAdminAction(ctx, action, []);
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
