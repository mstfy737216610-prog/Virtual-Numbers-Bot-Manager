 /*
  Command: manageprices
  Admin: run to list all countries and prices
  Usage: manageprices
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var cfg = Bot.getProperty('config') || {};
var currency = (cfg.bot && cfg.bot.currency) || 'USD';
var lines = [];
var totalCountries = 0;

Object.keys(cfg.providers || {}).forEach(function(p) {
  var prov = cfg.providers[p] || {};
  var countries = prov.countries || [];

  if (!countries.length) return;

  lines.push('━━━ ' + p + ' ━━━');

  countries.forEach(function(c) {
    var status = c.enabled === false ? '❌' : '✅';
    var code = (c.code || '??').toString().toUpperCase();
    var name = c.name || 'بدون اسم';
    var price = (typeof c.price !== 'undefined') ? c.price : '??';
    lines.push(status + ' ' + code + ' - ' + name + ' : ' + price + ' ' + currency);
    totalCountries++;
  });

  lines.push('');
});

if (!lines.length) {
  return Bot.sendMessage('لا توجد دول محددة.');
}

Bot.sendMessage(
  '💰 الأسعار (' + totalCountries + ' دولة):\n\n' +
  lines.join('\n').trim()
);