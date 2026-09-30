/*
  Command: sign_in
*/

var margin = Math.floor(100000 + Math.random() * 900000);
User.setProperty("captcha_answer", String(margin), "string");

var text = "✅ - لأمان حسابك *وحماية خصوصيتك*، نحتاج للتحقق من *انك انساناً ولست روبوتاً* أولاً. ♻️\n\n" +
  "🔘 - قم بكتابة الرقم الظاهر أمامك *[ `" + margin + "` ]* \n\n" +
  "☑️ - أرسل لنا *الإجابة الصحيحة* للتحقق من *انك لست روبوتاً.*";

var buttons = [ [ { text: "رجوع للخلف 🔙", callback_data: "back" } ] ];
Api.sendInlineKeyboard({ buttons: buttons, text: text, parse_mode: "Markdown" });
