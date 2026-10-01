/*
  Command: addcoin
  Admin: addcoin (simple wallet add)
  Usage: <user_id>|<amount>
  Example: addcoin 12345|5
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var rawText = message && message.text ? message.text.trim() : '';
var text = rawText.replace(/^\/?addcoin\s*/i, '').trim();

if (!text || text.indexOf('|') === -1) {
  return Bot.sendMessage('أرسل بالصيغة: userId|amount\nمثال: addcoin 12345|5');
}

var parts = text.split('|');
var uid = parts[0].trim();
var amt = parseFloat(parts[1]);

if (!uid || isNaN(amt)) {
  return Bot.sendMessage('بيانات غير صحيحة');
}

var balKey = 'balance_' + uid;
var cur = Bot.getProperty(balKey) || 0;
Bot.setProperty(balKey, cur + amt, 'number');

Bot.sendMessage('✅ تم إضافة الرصيد.\nالمستخدم: ' + uid + '\nالرصيد الجديد: ' + (cur + amt));