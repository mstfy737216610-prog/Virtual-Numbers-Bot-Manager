/*
  Command: delcoin
  Admin: delcoin (subtract)
  Usage: <user_id>|<amount>
  Example: delcoin 12345|5
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var rawText = message && message.text ? message.text.trim() : '';
var text = rawText.replace(/^\/?delcoin\s*/i, '').trim();

if (!text || text.indexOf('|') === -1) {
  return Bot.sendMessage('أرسل بالصيغة: userId|amount\nمثال: delcoin 12345|5');
}

var parts = text.split('|');
var uid = (parts[0] || '').trim();
var amt = parseFloat(parts[1]);

if (!uid || isNaN(amt) || amt <= 0) {
  return Bot.sendMessage('بيانات غير صحيحة');
}

var balKey = 'balance_' + uid;
var cur = Bot.getProperty(balKey) || 0;
var next = cur - amt;
if (next < 0) next = 0;

Bot.setProperty(balKey, next, 'number');

Bot.sendMessage('✅ تم خصم الرصيد.\nالمستخدم: ' + uid + '\nالرصيد السابق: ' + cur + '\nالرصيد الجديد: ' + next);