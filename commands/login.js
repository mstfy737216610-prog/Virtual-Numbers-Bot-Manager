/*
  Command: login
*/

var text = "♻️ - يرجى إرسال *رقم الهاتف* المرتبط بحسابك أو *معرف الحساب* المسجل مسبقاً للبدء.";
var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];

// clean keyboard before sending
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
