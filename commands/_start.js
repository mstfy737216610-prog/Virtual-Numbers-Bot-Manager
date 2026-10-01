/*
  Command: /start
  Updated to match PHP bot keyboard layout and labels (Arabic)
*/

var first_name = (user && user.first_name) ? user.first_name : "مستخدم";
var user_id = (user && (user.telegramid || user.id)) ? (user.telegramid || user.id) : 0;
var sudo = "8338869162"; // owner id, keep in sync with your config

var welcome_text = "♐️ - مرحبا بك [" + first_name + "](tg://user?id=" + user_id + ") ؛ 🤍\n\n" +
  "*- في بوت @Next_Plus_BOTp* ؛ البوت الأفضل على التليجرام والذي يقوم بتوفير *خدمات الأرقام الوهمية* ل مواقع السوشيال ميديا مثل *التيليجرام والواتساب والتويتر وغيره* 👾\n\n" +
  "*- قم بإنشاء حساب جديد* ؛ واذا كان لديك حساب من قبل: قم بالضغط على زر *تسجيل الدخول* ☑️";

var buttons = [
  [ { text: 'لديكَ حساب؟ تسجيل دخول 📲', callback_data: 'login' } ],
  [ { text: 'إنشاء حساب جديد ☑️', callback_data: 'sign_in' } ],
  [ { text: 'شروط الإستخدام وإخلاء للمسؤلية 🚨', callback_data: 'to_explain' } ],
  [ { text: 'إدارة البوت 👨🏻‍💻', url: 'tg://user?id=' + sudo } ],
  [ { text: 'هام للأعضاء الجُدد ⚠️', callback_data: 'Important' } ],
  [ { text: 'إحصائيات المستخدمين 📈', callback_data: 'statsbot2' } ]
];

// admin-specific quick menu (kept for developer convenience)
var admin_buttons = [
  [ { text: 'إضافة دولة ↗️', callback_data: 'addcountry' }, { text: 'حذف دولة 🚫', callback_data: 'delcountry' } ],
  [ { text: 'إضافة رصيد ♻️', callback_data: 'addcoin' }, { text: 'خصم رصيد 📛', callback_data: 'delcoin' } ],
  [ { text: 'إحصائيات البوت 🌚', callback_data: 'statsbot2' } ]
];

function safeClean(b) {
  try { if (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') return libs.keyboard.cleanKeyboard(b); } catch(e){}
  return (b || []).map(function(row){ return (row||[]).filter(function(x){ return x && (x.text || x.url || x.callback_data); }); }).filter(function(r){ return r && r.length>0; });
}

var cleaned = safeClean(buttons);
var cleanedAdmin = safeClean(admin_buttons);

if (String(user_id) === String(sudo)) {
  var admin_welcome = "♐️ - مرحبا بك " + first_name + " ؛ (لوحة المطور)";
  if (cleanedAdmin && cleanedAdmin.length > 0) {
    try {
      if (libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
        libs.sender.sendInlineKeyboard(admin_welcome, cleanedAdmin, { parse_mode: 'Markdown' });
      } else if (Api && typeof Api.sendMessage === 'function') {
        Api.sendMessage(admin_welcome, { parse_mode: 'Markdown' });
      } else {
        Bot.sendMessage(admin_welcome);
      }
    } catch (e) { Bot.sendMessage(admin_welcome); }
  } else {
    Bot.sendMessage(admin_welcome, { parse_mode: 'Markdown' });
  }
} else {
  if (cleaned && cleaned.length > 0) {
    try {
      if (libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
        libs.sender.sendInlineKeyboard(welcome_text, cleaned, { parse_mode: 'Markdown', disable_web_page_preview: true });
      } else if (Api && typeof Api.sendMessage === 'function') {
        Api.sendMessage(welcome_text, { parse_mode: 'Markdown', disable_web_page_preview: true });
      } else {
        Bot.sendMessage(welcome_text);
      }
    } catch (e) { Bot.sendMessage(welcome_text); }
  } else {
    Bot.sendMessage(welcome_text, { parse_mode: 'Markdown' });
  }
}
