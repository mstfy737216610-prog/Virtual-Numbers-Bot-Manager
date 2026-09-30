/*
  Admin: statsbot2
*/
var admins = Bot.getProperty('config') && Bot.getProperty('config').admin_ids || ['8338869162']; var totalSales = Bot.getProperty('total_sales') || 0; var totalActivations = Bot.getProperty('total_activations') || 0; var revenue = Bot.getProperty('revenue') || 0; Bot.sendMessage('🔎 إحصائيات البوت:\nمجموع المبيعات: ' + totalSales + '\nمجموع التفعيلات: ' + totalActivations + '\nالإيرادات التقريبية: ' + revenue);
