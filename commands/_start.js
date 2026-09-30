/*
  Command: /start
  Safe implementation: uses libs.keyboard.cleanKeyboard and libs.sender.sendInlineKeyboard (with fallbacks)
*/

var first_name = (user && user.first_name) ? user.first_name : "مستخدم";
var user_id = (user && (user.telegramid || user.id)) ? (user.telegramid || user.id) : 0;
var admin_id = "8338869162"; // change if needed

var welcome_text = "♐️ - مرحبا بك [" + first_name + "](tg://user?id=" + user_id + ")\n\n" +
  "السلامة أولاً — مرحبًا بك في بوت الأرقام.\n\n" +
  "اضغط أحد الخيارات أدناه للمتابعة.";

var buttons = [
  [ { text: "لديكَ حساب؟ تسجيل دخول 📲", callback_data: "login" } ],
  [ { text: "إنشاء حساب جديد ☑️", callback_data: "sign_in" } ],
  [ { text: "شروط الإستخدام 🚨", callback_data: "to_explain" } ],
  [ { text: "اتصل بالمطور 👨🏻‍💻", url: "tg://user?id=" + admin_id } ]
];

var admin_buttons = [
  [ { text: "إضافة دولة ↗️", callback_data: "addcountry" }, { text: "حذف دولة 🚫", callback_data: "delcountry" } ],
  [ { text: "إضافة رصيد ♻️", callback_data: "addcoin" }, { text: "خصم رصيد 📛", callback_data: "delcoin" } ],
  [ { text: "إحصائيات البوت 🌚", callback_data: "statsbot2" } ]
];

// Clean buttons safely
function safeClean(b) {
  try {
    if (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') return libs.keyboard.cleanKeyboard(b);
  } catch (e) {}
  // fallback
  return (b || []).map(function(row){ return (row||[]).filter(function(x){ return x && (x.text || x.url || x.callback_data); }); }).filter(function(r){ return r && r.length>0; });
}

var cleaned = safeClean(buttons);
var cleanedAdmin = safeClean(admin_buttons);

if (String(user_id) === String(admin_id)) {
  var admin_welcome = "مرحبا مطورـي البوت " + first_name + "\n\nقائمة التحكم:";
  if (cleanedAdmin && cleanedAdmin.length > 0) {
    // use libs.sender if available
    try {
      if (libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
        libs.sender.sendInlineKeyboard(admin_welcome, cleanedAdmin, { parse_mode: "Markdown" });
      } else if (Api && typeof Api.sendMessage === 'function') {
        Api.sendMessage(admin_welcome, { parse_mode: "Markdown" });
      } else {
        Bot.sendMessage(admin_welcome);
      }
    } catch (e) { Bot.sendMessage(admin_welcome); }
  } else {
    Bot.sendMessage(admin_welcome, { parse_mode: "Markdown" });
  }
} else {
  if (cleaned && cleaned.length > 0) {
    try {
      if (libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
        libs.sender.sendInlineKeyboard(welcome_text, cleaned, { parse_mode: "Markdown" });
      } else if (Api && typeof Api.sendMessage === 'function') {
        Api.sendMessage(welcome_text, { parse_mode: "Markdown" });
      } else {
        Bot.sendMessage(welcome_text);
      }
    } catch (e) { Bot.sendMessage(welcome_text); }
  } else {
    Bot.sendMessage(welcome_text, { parse_mode: "Markdown" });
  }
}
