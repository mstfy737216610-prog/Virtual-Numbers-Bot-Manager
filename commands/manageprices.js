/*
  Admin: manageprices
  Lists all countries and prices (no inline keyboard required)
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');

var cfg = Bot.getProperty('config') || (function(){ try { var r = HTTP.get('https://raw.githubusercontent.com/mstfy737216610-prog/Virtual-Numbers-Bot-Manager/main/data/config.json'); return r && r.status==200 ? JSON.parse(r.body) : {}; } catch(e){ return {}; } })();
var lines = [];
Object.keys(cfg.providers || {}).forEach(function(p){
  (cfg.providers[p].countries || []).forEach(function(c){
    lines.push(c.code + ' - ' + c.name + ' : ' + c.price + ' ' + (cfg.bot && cfg.bot.currency || 'USD'));
  });
});

if (lines.length == 0) Bot.sendMessage('لا توجد دول محددة'); else Bot.sendMessage(lines.join('\n'));
