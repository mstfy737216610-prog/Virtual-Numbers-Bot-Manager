import db from '../db/index.js';
import { mainKeyboard, adminKeyboard } from './keyboards.js';

export async function handleStart(ctx) {
  const adminId = String(process.env.DEFAULT_ADMIN || '8338869162');
  const userId = String(ctx.from.id);

  const markup = userId === adminId ? adminKeyboard() : mainKeyboard();
  const text = userId === adminId
    ? '♐️ - مرحبا بك مطور البوت 👨‍💻\n\n- لوحة التحكم متاحة الآن.'
    : '♐️ - مرحبا بك [' + (ctx.from.first_name || 'مستخدم') + '](tg://user?id=' + ctx.from.id + ') ؛ 🤍\n\n*- في بوت @Next_Plus_BOTp* ؛ البوت الأفضل على التليجرام والذي يقوم بتوفير *خدمات الأرقام الوهمية*.
\n*- قم بإنشاء حساب جديد* ، واذا كان لديك حساب من قبل: قم بالضغط على زر *تسجيل الدخول* ☑️';

  if (ctx.updateType === 'callback_query') {
    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: markup
    });
  }

  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: markup
  });
}

export async function handleStats(ctx) {
  const usersCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  const providersCount = db.prepare('SELECT COUNT(*) AS c FROM providers').get().c;
  const totalBalance = db.prepare('SELECT COALESCE(SUM(balance), 0) AS total FROM users').get().total;
  const ordersCount = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;

  const text = `📊 - إحصائيات البوت :\n\n✅ - عدد المستخدمين: *${usersCount}*\n📦 - عدد المزودين: *${providersCount}*\n💰 - إجمالي الرصيد: *${Number(totalBalance).toFixed(2)}*\n🧾 - عدد الطلبات: *${ordersCount}*`;

  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: mainKeyboard()
  });
}

export async function handleTerms(ctx) {
  const text = '• *مرحبا بك عزيزي في قسم التعليمات والشروط.*\n\n• *شروط البوت :* ↘️\n\n- هذا البوت يقوم بجلب أرقام وهمية لكل خدمات التواصل الاجتماعي.\n- لا يتحمل البوت مسؤولية الأرقام بعد شرائها.\n\n• *للاستفسار*: @Engku8';
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: mainKeyboard()
  });
}

export async function handleLogin(ctx) {
  const text = '♻️ - يرجى إرسال إيميلك أو اسم المستخدم الخاص بك لتسجيل الدخول.';
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: mainKeyboard()
  });
}

export async function handleSignup(ctx) {
  const text = '✅ - أرسل كلمة المرور المراد تعيينها أو اكتب "signup <pass>" إذا كنت تستخدم الأمر النصي.';
  return ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: mainKeyboard()
  });
}

export async function handleAdmin(ctx) {
  return ctx.reply('🛠️ - لوحة الإدارة', {
    reply_markup: adminKeyboard()
  });
}
