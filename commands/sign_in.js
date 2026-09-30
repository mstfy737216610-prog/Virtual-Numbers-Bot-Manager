/*
  Command: sign_in
*/

var margin = Math.floor(100000 + Math.random() * 900000);
User.setProperty("captcha_answer", String(margin), "string");

var text = "✅ - لأمان حسابك *وحماية خصوصيتك*، نحتاج للتحقق من *انك انساناً ولست روبوتاً* أولاً. ♻️\n\n" +
  "🔘 - قم بكتابة الرقم الظاهر أمامك *[ `" + margin + "` ]* \n\n" +
  "☑️ - أرسل لنا *الإجابة الصحيحة* للتحقق من *انك لست روبوتاً.*";

var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];
var cleanedButtons = (libs && libs.keyboard && libs.keyboard.cleanKeyboard) ? libs.keyboard.cleanKeyboard(buttons) : buttons;

if (cleanedButtons && cleanedButtons.length > 0) {
  libs.sender.sendInlineKeyboard(text, cleanedButtons, { parse_mode: "Markdown" });
} else {
  Bot.sendMessage(text, { parse_mode: "Markdown" });
}
