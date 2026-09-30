/*
  Command: to_explain
*/

var text = "• *مرحبا بك عزيزي في قسم التعليمات والشروط.*\n\n" +
  "• *شروط البوت :* ↘️\n\n" +
  "- هذا البوت يقوم بجلب أرقام وهمية لجميع مواقع السوشيال ميديا.\n" +
  "- البوت لا يتحمل مسؤولية الأرقام في حالة أنها انحظرت.\n\n" +
  "• *للإستفسار تواصل معنا:* @Engku8 .";

var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];
var cleanedButtons = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(buttons) : buttons;

if (cleanedButtons && cleanedButtons.length > 0) {
  libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: "Markdown" });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown" });
}
