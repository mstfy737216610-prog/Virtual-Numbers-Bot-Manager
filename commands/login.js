/*
  Command: login
  Safe inline keyboard usage
*/
var text = "♻️ - يرجى إرسال *رقم الهاتف* المرتبط بحسابك أو *معرف الحساب* المسجل مسبقاً للبدء.";
var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];

var cleanedButtons = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(buttons) : (buttons || []);
try {
  if (cleanedButtons && cleanedButtons.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: "Markdown" });
  } else if (Api && typeof Api.sendMessage === 'function') {
    Api.sendMessage(text, { parse_mode: "Markdown" });
  } else {
    Bot.sendMessage(text);
  }
} catch (e) { Bot.sendMessage(text); }
