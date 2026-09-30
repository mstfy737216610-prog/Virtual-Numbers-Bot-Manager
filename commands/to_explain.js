/*
  Command: to_explain
  Help / terms page (Arabic), buttons same order as PHP
*/
var text = "• *مرحبا بك عزيزي في قسم التعليمات والشروط.*\n\n• *شروط البوت :* ↘️\n\n- هذا البوت يقوم بجلب أرقام وهمية لجميع مواقع السوشيال ميديا ولمعظم الدول.\n- البوت لايتحمل مسؤولية الأرقام في حالة أنها انحظرت او انسرقت , بمعنى البوت لايتحمل مسؤولية الرقم بعد شرائه.\n\n• *للإستفسار تواصل معنا:* @Engku8 .";
var buttons = [ [ { text: 'رجوع للخلف 🔙', callback_data: 'startup' } ] ];
var cleanedButtons = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(buttons) : buttons;
try {
  if (cleanedButtons && cleanedButtons.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: 'Markdown', disable_web_page_preview: true });
  } else if (Api && typeof Api.sendMessage === 'function') {
    Api.sendMessage(text, { parse_mode: 'Markdown', disable_web_page_preview: true });
  } else {
    Bot.sendMessage(text);
  }
} catch (e) { Bot.sendMessage(text); }
