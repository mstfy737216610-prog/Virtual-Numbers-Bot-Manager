/*
  Command: statsbot2
  Admin: Show basic bot statistics
  Usage: statsbot2
*/

var config = Bot.getProperty('config') || {};
var admins = config.admin_ids || ['8338869162'];

if (admins.indexOf(String(user.telegramid)) === -1) {
  return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');
}

var totalSales = Number(Bot.getProperty('total_sales')) || 0;
var totalActivations = Number(Bot.getProperty('total_activations')) || 0;
var revenue = Number(Bot.getProperty('revenue')) || 0;
var currency = (config.bot && config.bot.currency) || 'USD';
var providerKeys = Object.keys(config.providers || {});
var totalCountries = 0;

providerKeys.forEach(function(p) {
  var prov = config.providers[p] || {};
  totalCountries += (prov.countries || []).length;
});

var totalChannels = (config.channels || []).length;
var msg = '📊 *إحصائيات البوت*\n' +
  '━━━━━━━━━━━━━━━\n' +
  '💰 مجموع المبيعات: *' + totalSales + '*\n' +
  '📨 مجموع التفعيلات: *' + totalActivations + '*\n' +
  '💵 الإيرادات التقريبية: *' + revenue + ' ' + currency + '*\n' +
  '━━━━━━━━━━━━━━━\n' +
  '🌍 عدد الدول: *' + totalCountries + '*\n' +
  '🔌 عدد المزودين: *' + providerKeys.length + '*\n' +
  '📢 عدد القنوات: *' + totalChannels + '*\n' +
  '━━━━━━━━━━━━━━━';

try {
  Bot.sendMessage(msg, { parse_mode: 'Markdown' });
} catch (e) {
  Bot.sendMessage(msg.replace(/\*/g, ''));
}
