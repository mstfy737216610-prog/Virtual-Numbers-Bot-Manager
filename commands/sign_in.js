/*
  Command: sign_in
*/

var margin = Math.floor(100000 + Math.random() * 900000);
var text = "✅ - لأمان حسابك *وحماية خصوصيتك*، نحتاج للتحقق من *انك انساناً ولست روبوتاً* اولاً. ♻️\n\n" +
  "🔘 - قم بكتابة الرقم الظاهر أمامك *[ " + margin + " ]* \n\n" +
  "☑️ - أرسل لنا *الإجابة الصحيحة* للتحقق من *انك لست روبوتاً.*";

Bot.sendMessage(text);
// Set next command to check the answer...
