/*
  Admin: addcountry
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
var text = message && message.text ? message.text.trim() : '';
if (!text || text.indexOf('|') === -1) return Bot.sendMessage('أرسل البيانات: code|name|price');
var parts = text.split('|'); var code = parts[0].trim(); var name = parts[1].trim(); var price = parseFloat(parts[2]); if (!code || !name || isNaN(price)) return Bot.sendMessage('البيانات غير صحيحة.');
var cfg = Bot.getProperty('config') || {}; if (!cfg.providers) cfg.providers = {}; var defaultProv = cfg.default_provider || Object.keys(cfg.providers)[0] || 'herosms'; if (!cfg.providers[defaultProv]) cfg.providers[defaultProv] = { enabled:true, api_key:'', countries:[] };
cfg.providers[defaultProv].countries.push({ code: code, name: name, enabled:true, price: price }); Bot.setProperty('config', cfg, 'json'); Bot.sendMessage('✅ تم إضافة الدولة: ' + name + ' (' + code + ') - ' + price);
