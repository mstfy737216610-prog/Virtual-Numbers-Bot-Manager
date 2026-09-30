/*
  Command: /start
*/

var first_name = user.first_name;
var user_id = user.telegramid;
var admin_id = "8338869162"; 

var welcome_text = "♐️ - مرحبا بك [" + first_name + "](tg://user?id=" + user_id + ") ؛ 🤍\n\n" +
  "*- في بوت @pilotoooo* ؛ البوت الأفضل على التليجرام والذي يقوم بتوفير *خدمات الأرقام الوهمية* ل مواقع السوشيال ميديا مثل *التيليجرام والواتساب والتويتر وغيره* 👾\n\n" +
  "*- قم بإنشاء حساب جديد* ؛ واذا كان لديك حساب من قبل: قم بالضغط على زر *تسجيل الدخول* ☑️";

var buttons = [
  [ { text: "لديكَ حساب؟ تسجيل دخول 📲", callback_data: "login" } ],
  [ { text: "إنشاء حساب جديد ☑️", callback_data: "sign_in" } ],
  [ { text: "شروط الإستخدام وإخلاء للمسؤلية 🚨", callback_data: "to_explain" } ],
  [ { text: "إدارة البوت 👨🏻‍💻", url: "tg://user?id=" + admin_id } ]
];

if (user_id == admin_id) {
  var admin_welcome = "- اهلا وسهلا مطوري " + first_name + " ، 🖤\n\n- هذه هي قائمة التحكم الخاصة بك في البوت 💁🏻";
  var admin_buttons = [
    [ { text: "إضافة دولة ↗️", callback_data: "addnumber" }, { text: "حذف دولة 🚫", callback_data: "delnumber" } ],
    [ { text: "إضافة رصيد ♻️", callback_data: "addcoin" }, { text: "خصم رصيد 📛", callback_data: "delcoin" } ],
    [ { text: "إحصائيات البوت 🌚", callback_data: "statsbot2" } ]
  ];
  Api.sendInlineKeyboard({
    buttons: admin_buttons,
    text: admin_welcome,
    parse_mode: "Markdown"
  });
} else {
  Api.sendInlineKeyboard({
    buttons: buttons,
    text: welcome_text,
    parse_mode: "Markdown"
  });
}
