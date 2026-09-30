/*
  Admin: statsbot2
  Simple stats: total users (approx via property scan not available everywhere)
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162'];
if (admins.indexOf(String(user.telegramid)) === -1) return Bot.sendMessage('ليس لديك صلاحية استخدام هذا الأمر.');

// show basic stats saved in properties
var totalSales = Bot.getProperty('total_sales') || 0;
var totalActivations = Bot.getProperty('total_activations') || 0;
var revenue = Bot.getProperty('revenue') || 0;

Bot.sendMessage('🔎 إحصائيات البوت:\nمجموع المبيعات: ' + totalSales + '\nمجموع التفعيلات: ' + totalActivations + '\nالإيرادات التقريبية: ' + revenue);
