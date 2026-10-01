/*
  Command: check_sms
  Usage: run to check status of last activation
*/

var last = User.getProperty('last_activation');
if (!last) {
  return Bot.sendMessage('لا يوجد تفعيل محفوظ للتحقق منه.');
}

// -------- Determine provider --------
var cfg = Bot.getProperty('config') || {};
var provider =
  last.service ||
  last.provider ||
  cfg.default_provider ||
  Object.keys(cfg.providers || {})[0] ||
  '5sim';

// -------- Determine activation id (try multiple keys) --------
var activationId =
  last.activation_id ||
  last.activationId ||
  last.id ||
  last.idnumber ||
  last.id_number ||
  last.idActivation ||
  null;

if (!activationId) {
  return Bot.sendMessage('لم أجد معرّف التفعيل في بيانات الحفظ. يرجى إعطاء تفاصيل التفعيل.');
}

// -------- Get api key --------
var apiKey = '';
if (cfg.providers && cfg.providers[provider] && cfg.providers[provider].api_key) {
  apiKey = cfg.providers[provider].api_key;
}

var params = {
  api_key: apiKey,
  idnumber: activationId,
  activationId: activationId   // دعم كلا الاسمين
};

// -------- Check provider lib --------
if (!libs || !libs.SMSProvider || typeof libs.SMSProvider.checkNumberStatus !== 'function') {
  return Bot.sendMessage('خدمة فحص الرسائل غير متاحة حالياً.');
}

// -------- Call provider --------
try {
  var res = libs.SMSProvider.checkNumberStatus(provider, params);

  if (!res) {
    return Bot.sendMessage('فشل الاتصال بالمزوّد.');
  }

  // فحص متعدد الصيغ للنجاح
  var isOk =
    res.ok === true ||
    (res.status && (res.status == 200 || res.status == 201));

  if (isOk) {
    var payload = res.data || res.raw || res.body || res;
    return Bot.sendMessage('📨 حالة التفعيل:\n' + JSON.stringify(payload, null, 2));
  }

  return Bot.sendMessage(
    'حدث خطأ عند جلب الحالة:\n' +
    JSON.stringify(res, null, 2)
  );
} catch (e) {
  return Bot.sendMessage('حدث خطأ أثناء فحص الرسائل: ' + (e.message || e));
}