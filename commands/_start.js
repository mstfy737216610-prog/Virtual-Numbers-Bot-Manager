/*
  Command: /start
*/

// BJS code for /start command
// Converted from PHP teampro.php

var first_name = user.first_name;
var user_id = user.telegramid;
var admin_id = "8338869162"; // Default admin from PHP

// Welcome message in Arabic as in PHP
var welcome_text = "♐️ - مرحبا بك " + first_name + " ؛ 🤍\n\n" +
  "*- في بوت @pilotoooo* ؛ البوت الأفضل على التليجرام والذي يقوم بتوفير *خدمات الأرقام الوهمية* ل مواقع السوشيال ميديا مثل *التيليجرام والواتساب والتويتر وغيره* 👾\n\n" +
  "*- قم بإنشاء حساب جديد* ؛ واذا كان لديك حساب من قبل: قم بالضغط على زر *تسجيل الدخول* ☑️";

var buttons = [
  [ { text: "لديكَ حساب؟ تسجيل دخول 📲", callback_data: "login" } ],
  [ { text: "إنشاء حساب جديد ☑️", callback_data: "sign_in" } ],
  [ { text: "شروط الإستخدام وإخلاء للمسؤلية 🚨", callback_data: "to_explain" } ],
  [ { text: "إدارة البوت 👨🏻‍💻", url: "tg://user?id=" + admin_id } ],
  [ { text: "هام للأعضاء الجُدد ⚠️", callback_data: "Important" } ],
  [ { text: "إحصائيات المستخدمين 📈", callback_data: "statsbot2" } ]
];

// If user is admin
if (user_id == admin_id) {
  var admin_welcome = "- اهلا وسهلا مطوري " + first_name + " ، 🖤\n\n- هذه هي قائمة التحكم الخاصة بك في البوت 💁🏻";
  var admin_buttons = [
    [ { text: "حذف دولة 🚫", callback_data: "delnumber" }, { text: "إضافة دولة ↗️", callback_data: "addnumber" } ],
    [ { text: "خصم رصيد 📛", callback_data: "delcoin" }, { text: "إضافة رصيد ♻️", callback_data: "addcoin" } ],
    [ { text: "حذف رقم جاهز ⬆️", callback_data: "delreadynumber" }, { text: "أضف رقم جاهز 📞", callback_data: "readynumber" } ],
    [ { text: "فتح وقفل الأقسام 🔏", callback_data: "opclo" }, { text: "إحصائيات البوت 🌚", callback_data: "baluser" } ],
    [ { text: "رفع وحذف API ⤵️", callback_data: "counapi" } ],
    [ { text: "رجوع", callback_data: "back" } ]
  ];
  Bot.sendInlineKeyboard(admin_buttons, admin_welcome);
} else {
  Bot.sendInlineKeyboard(buttons, welcome_text);
}
