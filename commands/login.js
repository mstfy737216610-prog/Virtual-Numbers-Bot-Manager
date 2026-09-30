/*
  Command: login
  Matches PHP labels and order
*/
var emile = (user && user.username) ? user.username : null;
var emile_exists = (typeof emile !== 'undefined' && emile !== null) ? emile : "لايوجد";

var text = "♻️ - يرجى إرسال الحساب او الإيميل الذي تريد تسجيل الدخول عليه ، (يجب أن يكون هذا الإيميل مسجل بالبوت. ⚠️)\n\n☑️ - اذا لديك حساب من قبل سيظهر في الاسفل ، إضغط عليه لتسجيل الدخول ✅.";
var buttons = [ [ { text: "- " + emile_exists + " .", callback_data: "emils-" + emile_exists + "-" + (User.getProperty('temp_pass') || '') } ], [ { text: "- رجوع.", callback_data: "startup" } ] ];

var cleanedButtons = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(buttons) : buttons;
try {
  if (cleanedButtons && cleanedButtons.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: 'Markdown' });
  } else if (Api && typeof Api.sendMessage === 'function') {
    Api.sendMessage(text, { parse_mode: 'Markdown' });
  } else {
    Bot.sendMessage(text);
  }
} catch (e) { Bot.sendMessage(text); }
