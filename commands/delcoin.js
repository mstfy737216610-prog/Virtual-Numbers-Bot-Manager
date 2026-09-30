/*
  Admin: delcoin
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');

var text = message && message.text ? message.text.trim() : '';
if (!text || text.indexOf('|') === -1) return Bot.sendMessage('أرسل بالصيغة: userId|amount');
var parts = text.split('|');
var uid = parts[0].trim();
var amt = parseFloat(parts[1]);
if (!uid || isNaN(amt)) return Bot.sendMessage('بيانات غير صحيح��');

var balKey = 'balance_' + uid;
var cur = Bot.getProperty(balKey) || 0;
var next = cur - amt;
if (next < 0) next = 0;
Bot.setProperty(balKey, next, 'number');
Bot.sendMessage('✅ تم خصم الرصيد. المستخدم: ' + uid + ' الرصيد الجديد: ' + next);
