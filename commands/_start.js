/*
  Command: /start
*/

var first_name = (user && user.first_name) ? user.first_name : "مستخدم";
var user_id = (user && (user.telegramid || user.id)) ? (user.telegramid || user.id) : 0;
var sudo = "8338869162";

var welcome_text = "♐️ - مرحبا بك [" + first_name + "](tg://user?id=" + user_id + ") ؛ 🤍\n\n" +
  "*- في بوت @Next_Plus_BOTp* ؛ البوت الأفضل على التليجرام والذي يقوم بتوفير *خدمات الأرقام الوهمية* ل مواقع السوشيال ميديا مثل *التيليجرام والواتساب والتويتر وغيره* 👾\n\n" +
  "*- قم بإنشاء حساب جديد* ؛ واذا كان لديك حساب من قبل: قم بالضغط على زر *تسجيل الدخول* ☑️";

var keyboard = {
  inline_keyboard: [
    [ { text: 'لديكَ حساب؟ تسجيل دخول 📲', callback_data: 'login' } ],
    [ { text: 'إنشاء حساب جديد ☑️', callback_data: 'sign_in' } ],
    [ { text: 'شروط الإستخدام وإخلاء للمسؤلية 🚨', callback_data: 'to_explain' } ],
    [ { text: 'إدارة البوت 👨🏻‍💻', url: 'tg://user?id=' + sudo } ],
    [ { text: 'هام للأعضاء الجُدد ⚠️', callback_data: 'Important' } ],
    [ { text: 'إحصائيات المستخدمين 📈', callback_data: 'statsbot2' } ]
  ]
};

Bot.sendMessage(welcome_text, {
  parse_mode: 'Markdown',
  disable_web_page_preview: true,
  reply_markup: JSON.stringify(keyboard)
});
