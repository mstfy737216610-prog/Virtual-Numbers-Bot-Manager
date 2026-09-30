/*
  Command: login
*/

var text = "♻️ - يرجى إرسال *رقم الهاتف* المرتبط بحسابك أو *معرف الحساب* المسجل مسبقاً للبدء.";
var buttons = [
  [ { text: "رجوع للخلف 🔙", callback_data: "back" } ]
];

Api.sendInlineKeyboard({
  buttons: buttons,
  text: text,
  parse_mode: "Markdown"
});
