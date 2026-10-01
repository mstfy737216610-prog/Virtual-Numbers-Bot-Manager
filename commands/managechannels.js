/*
  Command: managechannels
  Admin: run to list all channels
  Usage: managechannels
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var cfg = Bot.getProperty('config') || {};
var channels = cfg.channels || [];

if (!channels.length) {
  return Bot.sendMessage('لا توجد قنوات محددة.');
}

var lines = channels.map(function(ch, i) {
  var status = ch.enabled ? '✅' : '❌';
  var name = ch.name || ch.username || ch.id || 'بدون اسم';
  return (i + 1) + '. ' + status + ' ' + name;
});

Bot.sendMessage(
  '📢 قائمة القنوات (' + channels.length + '):\n\n' +
  lines.join('\n')
);