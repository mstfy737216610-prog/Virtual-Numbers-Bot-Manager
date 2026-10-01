/*
  Command: sign_in
  CAPTCHA step and creation button (Arabic)
*/
var margin = Math.floor(100000 + Math.random() * 900000);
User.setProperty('captcha_answer_temp', String(margin), 'string');

var text = "✅ - لأمان حسابك *وحماية خصوصيتك*، نحتاج للتحقق من *أنك إنساناً ولست روبوتاً* أولاً. ♻️\n\n🔘 - قم بكتابة الرقم التالي: *" + margin + "*\n\n- إذا كنت لا تريد إنشاء حساب جديد، يمكنك العودة للخلف.";
var buttons = [[{ text: 'رجوع للخلف 🔙', callback_data: 'startup' }]];

var cleanedButtons = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function')
  ? libs.keyboard.cleanKeyboard(buttons)
  : buttons;

try {
  if (cleanedButtons && cleanedButtons.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: 'Markdown' });
  } else {
    Bot.sendMessage(text, {
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify({ inline_keyboard: cleanedButtons })
    });
  }
} catch (e) {
  Bot.sendMessage(text, { parse_mode: 'Markdown' });
}
