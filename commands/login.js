/*
  Command: login
*/

var text = "♻️ - يرجى إرسال *رقم الهاتف* المرتبط بحسابك أو *معرف الحساب* المسجل مسبقاً للبدء.";
var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];

var cleanedButtons = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(buttons) : buttons;

if (cleanedButtons && cleanedButtons.length > 0) {
  libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: "Markdown" });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown" });
}
