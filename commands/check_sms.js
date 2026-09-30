/*
  Command: check_sms
  Usage: run to check status of last activation
*/
var last = User.getProperty('last_activation');
if (!last) return Bot.sendMessage('لا يوجد تفعيل محفوظ للتحقق منه.');

// determine provider and id
var provider = last.service || last.provider || (Bot.getProperty('config') && Bot.getProperty('config').default_provider) || '5sim';
var idnumber = last.activation_id || last.id || last.idnumber || last.idActivation || last.id_number || null;

if (!idnumber) return Bot.sendMessage('لم أجد معرّف التفعيل في بيانات الحفظ. يرجى إعطاء تفاصيل التفعيل.');

var params = { api_key: (Bot.getProperty('config') && Bot.getProperty('config').providers && Bot.getProperty('config').providers[provider] && Bot.getProperty('config').providers[provider].api_key) || '', idnumber: idnumber };
var res = libs.SMSProvider.checkNumberStatus(provider, params);
if (!res) return Bot.sendMessage('فشل الاتصال بالمزوّد.');

if (res.status && res.status == 200) {
  Bot.sendMessage('حالة التفعيل:\n' + JSON.stringify(res.data || res.body || res));
} else {
  Bot.sendMessage('حدث خطأ عند جلب الحالة:\n' + JSON.stringify(res));
}
