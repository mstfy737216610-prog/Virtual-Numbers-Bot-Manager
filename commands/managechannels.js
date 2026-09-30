/*
  Admin: managechannels
  Usage: run to list channels
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');

var cfg = Bot.getProperty('config') || (function(){ try { var r = HTTP.get('https://raw.githubusercontent.com/mstfy737216610-prog/Virtual-Numbers-Bot-Manager/main/data/config.json'); return r && r.status==200 ? JSON.parse(r.body) : {}; } catch(e){ return {}; } })();
var lines = (cfg.channels || []).map(function(ch){ return (ch.enabled ? '✅ ' : '❌ ') + ch.name; });
if (lines.length == 0) Bot.sendMessage('لا توجد قنوات محددة'); else Bot.sendMessage(lines.join('\n'));
