/*
  Command: sign_in
*/

var margin = Math.floor(100000 + Math.random() * 900000);
User.setProperty("captcha_answer", String(margin), "string");

var text = "✅ - لأمان حسابك *وحماية خصوصيتك*، نحتاج للتحقق من *انك انساناً ولست روبوتاً* أولاً. ♻️\n\n" +
  "🔘 - قم بكتابة الرقم الظاهر أمامك *[ `" + margin + "` ]* \n\n" +
  "☑️ - أرسل لنا *الإجابة الصحيحة* للتحقق من *انك لست روبوتاً.*";

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
