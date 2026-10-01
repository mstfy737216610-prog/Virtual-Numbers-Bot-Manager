/*
  Command: addcountry
  Admin: Add a country to the default provider
  Usage: send as text: code|name|price
  Example: addcountry eg|Egypt|1.5
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var rawText = message && message.text ? message.text.trim() : '';
var text = rawText.replace(/^\/?addcountry\s*/i, '').trim();

if (!text || text.indexOf('|') === -1) {
  return Bot.sendMessage('أرسل بيانات الدولة بهذا الشكل: code|name|price\nمثال: addcountry eg|Egypt|1.5');
}

var parts = text.split('|');
var code = (parts[0] || '').trim().toLowerCase();
var name = (parts[1] || '').trim();
var price = parseFloat(parts[2]);

if (!code || !name || isNaN(price) || price <= 0) {
  return Bot.sendMessage('البيانات غير صحيحة. تأكد من أن السعر رقم موجب.');
}

var cfg = Bot.getProperty('config') || {};
if (!cfg.providers) cfg.providers = {};

var defaultProv = cfg.default_provider || Object.keys(cfg.providers)[0] || '5sim';
if (!cfg.providers[defaultProv]) {
  cfg.providers[defaultProv] = { enabled: true, api_key: '', countries: [] };
}
if (!cfg.providers[defaultProv].countries) {
  cfg.providers[defaultProv].countries = [];
}

var exists = cfg.providers[defaultProv].countries.some(function(c) {
  return c.code === code;
});

if (exists) {
  return Bot.sendMessage('هذه الدولة موجودة بالفعل: ' + code);
}

cfg.providers[defaultProv].countries.push({
  code: code,
  name: name,
  enabled: true,
  price: price
});

Bot.setProperty('config', cfg, 'json');
Bot.sendMessage('✅ تم إضافة الدولة: ' + name + ' (' + code + ') - السعر: ' + price);