/*
  Command: check_sms
*/
var last = User.getProperty('last_activation');
if (!last) return Bot.sendMessage('لا يوجد تفعيل محفوظ للتحقق منه.');
var provider = last.provider || (Bot.getProperty('config') && Bot.getProperty('config').default_provider) || 'herosms';
var activationId = last.activationId || last.id || last.activation_id || null;
if (!activationId) return Bot.sendMessage('لم أجد معرّف التفعيل في بيانات الحفظ.');
var params = { api_key: (Bot.getProperty('config') && Bot.getProperty('config').providers && Bot.getProperty('config').providers[provider] && Bot.getProperty('config').providers[provider].api_key) || '', activationId: activationId };
var res = libs.SMSProvider.checkNumberStatus(provider, params);
if (!res || !res.ok) return Bot.sendMessage('فشل الاتصال بالمزوّد: ' + (res && res.error || 'unknown'));
Bot.sendMessage('حالة التفعيل:\n' + JSON.stringify(res.data || res.raw || res));
