/*
  Command: to_explain
*/

var text = "• *مرحبا بك عزيزي في قسم التعليمات والشروط.*\n\n" +
  "• *شروط البوت :* ↘️\n\n" +
  "- هذا البوت يقوم بجلب أرقام وهمية لجميع مواقع السوشيال ميديا.\n" +
  "- البوت لا يتحمل مسؤولية الأرقام في حالة أنها انحظرت.\n\n" +
  "• *للإستفسار تواصل معنا:* @Engku8 .";

var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];

// clean keyboard
var cleanedButtons;
try {
  cleanedButtons = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(buttons) : buttons;
} catch (e) {
  cleanedButtons = (buttons || []).map(function(row){ return (row||[]).filter(function(b){ return b && (b.text || b.url || b.callback_data); }); }).filter(function(r){ return r && r.length>0; });
}

if (cleanedButtons && cleanedButtons.length > 0) {
  Api.sendInlineKeyboard({ buttons: cleanedButtons, text: text, parse_mode: "Markdown" });
} else {
  Api.sendMessage(text, { parse_mode: "Markdown" });
}
