/*
  Admin: delcountry
  Usage: send as text: code
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');

var code = message && message.text ? message.text.trim() : '';
if (!code) return Bot.sendMessage('أرسل رمز الدولة للحذف، مثال: us');

var cfg = Bot.getProperty('config');
if (!cfg || !cfg.providers) return Bot.sendMessage('لا توجد إعدادات.');

var found = false;
Object.keys(cfg.providers).forEach(function(p){
  var prov = cfg.providers[p];
  if (!prov.countries) return;
  var remaining = prov.countries.filter(function(c){ return c.code != code; });
  if (remaining.length !== prov.countries.length) {
    prov.countries = remaining;
    found = true;
  }
});

if (found) {
  Bot.setProperty('config', cfg, 'json');
  Bot.sendMessage('✅ تم حذف الدولة: ' + code);
} else {
  Bot.sendMessage('لم أجد دولة بالرمز: ' + code);
}
