/*
  Command: to_explain
  Help / terms page (Arabic), buttons same order as PHP
*/
var text = "• *مرحبا بك عزيزي في قسم التعليمات والشروط.*\n\n• *شروط البوت :* ↘️\n\n- هذا البوت يقوم بجلب أرقام وهمية لجلب خدمات السوشيال ميديا.\n- لا يجوز استخدام الخدمة في النشر أو الاحتيال أو أي استخدام غير قانوني.\n- استخدامك للبوت يعني موافقتك على الشروط والإشعارات.\n\n• *ملاحظة مهمة :*\n- قد يختلف توفر الرقم حسب المزود والبلد.\n- نوصيك بالتأكد من سياسة كل خدمة قبل استخدامها.";
var buttons = [[{ text: 'رجوع للخلف 🔙', callback_data: 'startup' }]];
var cleanedButtons = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(buttons) : buttons;

try {
  if (cleanedButtons && cleanedButtons.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: 'Markdown', disable_web_page_preview: true });
  } else {
    Bot.sendMessage(text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_markup: JSON.stringify({ inline_keyboard: cleanedButtons })
    });
  }
} catch (e) {
  Bot.sendMessage(text, { parse_mode: 'Markdown', disable_web_page_preview: true });
}
