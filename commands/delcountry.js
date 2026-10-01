/*
  Command: delcountry
  Admin: Delete a country from any provider
  Usage: send as text: code
  Example: delcountry eg
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var rawText = message && message.text ? message.text.trim() : '';
var code = rawText.replace(/^\/?delcountry\s*/i, '').trim().toLowerCase();

if (!code) {
  return Bot.sendMessage('أرسل رمز الدولة للحذف، مثال: delcountry us');
}

var cfg = Bot.getProperty('config');
if (!cfg || !cfg.providers) {
  return Bot.sendMessage('لا توجد إعدادات.');
}

var found = false;
var foundIn = [];

Object.keys(cfg.providers).forEach(function(p) {
  var prov = cfg.providers[p];
  if (!prov.countries || !prov.countries.length) return;

  var before = prov.countries.length;
  prov.countries = prov.countries.filter(function(c) {
    return String(c.code).toLowerCase() !== code;
  });

  if (prov.countries.length !== before) {
    found = true;
    foundIn.push(p);
  }
});

if (found) {
  Bot.setProperty('config', cfg, 'json');
  Bot.sendMessage(
    '✅ تم حذف الدولة: ' + code +
    '\nمن المزود: ' + foundIn.join(', ')
  );
} else {
  Bot.sendMessage('❌ لم أجد دولة بالرمز: ' + code);
}