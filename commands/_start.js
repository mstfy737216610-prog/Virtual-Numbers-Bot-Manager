/*
  Command: /start
*/

var first_name = user && user.first_name ? user.first_name : "مستخدم";
var user_id = user && user.telegramid ? user.telegramid : (user && user.id ? user.id : 0);
var admin_id = "8338869162";

var welcome_text = "♐️ - مرحبا بك [" + first_name + "](tg://user?id=" + user_id + ") ؛ 🤍\n\n" +
  "*- في بوت نمبر بوت* ؛ البوت الأفضل على التليجرام لتوفير *خدمات الأرقام الوهمية*.\n\n" +
  "*- قم بإنشاء حساب جديد* أو اضغط على *تسجيل الدخول* ☑️";

var buttons = [
  [ { text: "لديكَ حساب؟ تسجيل دخول 📲", callback_data: "login" } ],
  [ { text: "إنشاء حساب جديد ☑️", callback_data: "sign_in" } ],
  [ { text: "شروط الإستخدام وإخلاء المسؤولية 🚨", callback_data: "to_explain" } ],
  [ { text: "اتصل بالمطور 👨🏻‍💻", url: "tg://user?id=" + admin_id } ]
];

var admin_buttons = [
  [ { text: "إضافة دولة ↗️", callback_data: "addcountry" }, { text: "حذف دولة 🚫", callback_data: "delcountry" } ],
  [ { text: "إضافة رصيد ♻️", callback_data: "addcoin" }, { text: "خصم رصيد 📛", callback_data: "delcoin" } ],
  [ { text: "إحصائيات البوت 🌚", callback_data: "statsbot2" } ]
];

// Use the shared keyboard cleaner (libs/keyboard.js)
var cleaned, cleanedAdmin;
try {
  cleaned = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(buttons) : buttons;
  cleanedAdmin = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(admin_buttons) : admin_buttons;
} catch (e) {
  // fallback to simple filtering in case libs not loaded
  function fallbackClean(b) {
    return (b || []).map(function(row){ return (row||[]).filter(function(x){ return x && (x.text || x.url || x.callback_data); }); }).filter(function(r){ return r && r.length>0; });
  }
  cleaned = fallbackClean(buttons);
  cleanedAdmin = fallbackClean(admin_buttons);
}

if (String(user_id) === String(admin_id)) {
  var admin_welcome = "- اهلا وسهلا مطوري " + first_name + " ، 🖤\n\n- هذه هي قائمة التحكم الخاصة بك في البوت 💁🏻";
  if (cleanedAdmin && cleanedAdmin.length > 0) {
    Api.sendInlineKeyboard({ buttons: cleanedAdmin, text: admin_welcome, parse_mode: "Markdown" });
  } else {
    Api.sendMessage(admin_welcome, { parse_mode: "Markdown" });
  }
} else {
  if (cleaned && cleaned.length > 0) {
    Api.sendInlineKeyboard({ buttons: cleaned, text: welcome_text, parse_mode: "Markdown" });
  } else {
    Api.sendMessage(welcome_text, { parse_mode: "Markdown" });
  }
}
