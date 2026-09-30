import db from '../../db/index.js';
import { config } from '../../config.js';
import { mainKeyboard, adminKeyboard } from '../keyboards.js';

export function ensureAdmin(ctx) {
  const ids = String(config.ADMIN_IDS || config.DEFAULT_ADMIN || '').split(',').map((v) => v.trim()).filter(Boolean);
  return ids.includes(String(ctx.from?.id));
}

export function getOrCreateUserFromTelegram(from) {
  if (!from?.id) return null;
  let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(from.id));
  if (!user) {
    const email = `tg_${from.id}@bot.local`;
    const result = db.prepare(`INSERT INTO users (telegram_id, username, email, password_hash, role, balance) VALUES (?, ?, ?, ?, 'user', 0)`).run(String(from.id), from.username || '', email, 'managed-by-bot');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  } else if ((user.username || '') !== (from.username || '')) {
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(from.username || '', user.id);
    user.username = from.username || '';
  }
  return user;
}

export function getUserBalance(telegramId) {
  return Number(db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(String(telegramId))?.balance || 0);
}

function positiveAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) throw new Error('المبلغ يجب أن يكون أكبر من صفر');
  return value;
}

export function changeBalance(telegramId, amount, type, meta = {}) {
  const value = positiveAmount(amount);
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(String(telegramId));
  if (!user) return null;
  const next = type === 'debit' ? Number(user.balance) - value : Number(user.balance) + value;
  if (next < 0) throw new Error('الرصيد غير كافٍ');
  const transaction = db.transaction(() => {
    db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(next, user.id);
    db.prepare('INSERT INTO transactions (user_id, type, amount, status, meta) VALUES (?, ?, ?, ?, ?)').run(user.id, type, value, 'success', JSON.stringify(meta));
  });
  transaction();
  return next;
}

export function addBalance(id, amount, meta = {}) { return changeBalance(id, amount, 'credit', meta); }
export function deductBalance(id, amount, meta = {}) { return changeBalance(id, amount, 'debit', meta); }

export function listProviders() { return db.prepare('SELECT * FROM providers ORDER BY id DESC').all(); }
export function listApps() { return db.prepare('SELECT a.*, p.code AS provider_code, p.name AS provider_name FROM apps a JOIN providers p ON p.id=a.provider_id ORDER BY a.id DESC').all(); }
export function listServers() { return db.prepare('SELECT s.*, p.code AS provider_code, p.name AS provider_name FROM provider_servers s JOIN providers p ON p.id=s.provider_id ORDER BY s.id DESC').all(); }
export function listChannels() { return db.prepare('SELECT * FROM channels ORDER BY id DESC').all(); }
export function listCountries() { return db.prepare('SELECT * FROM countries ORDER BY name').all(); }
export function listPrices() { return db.prepare('SELECT p.*, pr.code AS provider_code, a.code AS app_code, a.name AS app_name FROM prices p JOIN providers pr ON pr.id=p.provider_id JOIN apps a ON a.id=p.app_id ORDER BY p.id DESC').all(); }
export function getRecentOrders(limit = 10) { return db.prepare('SELECT o.*, u.telegram_id, p.code provider_code, a.code app_code FROM orders o JOIN users u ON u.id=o.user_id LEFT JOIN providers p ON p.id=o.provider_id LEFT JOIN apps a ON a.id=o.app_id ORDER BY o.id DESC LIMIT ?').all(limit); }

export async function handleStart(ctx) {
  getOrCreateUserFromTelegram(ctx.from);
  const isAdmin = ensureAdmin(ctx);
  const text = isAdmin
    ? '♐️ - مرحباً بك في لوحة إدارة البوت 👨‍💻\n\nيمكنك إدارة المزودين والسيرفرات والتطبيقات والقنوات والأسعار والأرصدة من الأزرار أدناه.'
    : `♐️ - مرحباً بك [${ctx.from.first_name || 'مستخدم'}](tg://user?id=${ctx.from.id}) 🤍\n\n*- بوت إدارة الأرقام الافتراضية*\n\nاختر الخدمة المطلوبة من القائمة.`;
  const options = { parse_mode: 'Markdown', reply_markup: isAdmin ? adminKeyboard() : mainKeyboard() };
  if (ctx.callbackQuery) { await ctx.answerCbQuery().catch(() => {}); return ctx.editMessageText(text, options).catch(() => ctx.reply(text, options)); }
  return ctx.reply(text, options);
}

export async function handleStats(ctx) {
  const users = db.prepare('SELECT COUNT(*) c FROM users').get().c;
  const providers = db.prepare('SELECT COUNT(*) c FROM providers WHERE enabled=1').get().c;
  const orders = db.prepare('SELECT COUNT(*) c FROM orders').get().c;
  const balance = db.prepare('SELECT COALESCE(SUM(balance),0) total FROM users').get().total;
  return ctx.reply(`📊 *إحصائيات البوت*\n\n👥 المستخدمون: ${users}\n🧩 المزودون: ${providers}\n🧾 الطلبات: ${orders}\n💰 إجمالي الأرصدة: ${Number(balance).toFixed(2)}`, { parse_mode: 'Markdown', reply_markup: mainKeyboard() });
}

export async function handleTerms(ctx) { return ctx.reply('• *شروط الاستخدام*\n\n- استخدم الخدمة بشكل قانوني.\n- لا نضمن استمرار الرقم بعد الشراء.\n- لا تضع مفاتيح API أو بيانات حساسة في المستودع.', { parse_mode: 'Markdown', reply_markup: mainKeyboard() }); }
export async function handleLogin(ctx) { return ctx.reply('♻️ أرسل أمر `login <البريد>` لتسجيل الدخول.', { parse_mode: 'Markdown', reply_markup: mainKeyboard() }); }
export async function handleSignup(ctx) { return ctx.reply('✅ تم إنشاء حسابك تلقائياً. استخدم /balance لمعرفة رصيدك.', { reply_markup: mainKeyboard() }); }
export async function handleAdmin(ctx) { if (!ensureAdmin(ctx)) return ctx.reply('⛔️ لا تملك صلاحية الإدارة.'); return ctx.reply('🛠️ *لوحة الإدارة*', { parse_mode: 'Markdown', reply_markup: adminKeyboard() }); }
