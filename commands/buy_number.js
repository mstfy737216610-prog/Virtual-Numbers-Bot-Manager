/*
  Command: /buy
  Usage:
    - Send '/buy' to see available countries
    - Or send text: 'buy:us' to buy from country code 'us'
    - Admin can confirm purchase via 'confirm_buy:<provider>:<code>'
*/

// ============ Load config ============
function loadConfig() {
  var cfg = Bot.getProperty('config');
  if (cfg) return cfg;

  try {
    var raw = HTTP.get('https://raw.githubusercontent.com/mstfy737216610-prog/Virtual-Numbers-Bot-Manager/main/data/config.json');
    if (raw && raw.status == 200) {
      var parsed = JSON.parse(raw.body);
      Bot.setProperty('config', parsed, 'json');
      return parsed;
    }
  } catch (e) {}

  return { default_provider: '5sim', providers: {} };
}

// ============ Safe send keyboard ============
function safeSendKeyboard(text, rows) {
  var cleaned = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function')
    ? libs.keyboard.cleanKeyboard(rows)
    : (rows || []);

  if (!cleaned || cleaned.length === 0) {
    return Bot.sendMessage(text);
  }

  try {
    if (libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
      return libs.sender.sendInlineKeyboard(text, cleaned);
    }
    if (Api && typeof Api.sendInlineKeyboard === 'function') {
      return Api.sendInlineKeyboard({ buttons: cleaned, text: text });
    }
    if (typeof Api !== 'undefined' && typeof Api.sendMessage === 'function') {
      return Api.sendMessage(text);
    }
  } catch (e) {}

  return Bot.sendMessage(text);
}

// ============ Main ============
var config = loadConfig();
var text = message && message.text ? message.text.trim() : '';
var currency = (config.bot && config.bot.currency) || 'USD';

// -------- Buy by code: buy:us --------
if (text && text.toLowerCase().indexOf('buy:') === 0) {
  var code = text.split(':')[1];
  if (!code) return Bot.sendMessage('أدخل رمز الدولة بعد buy:, مثال: buy:us');

  var providerKey = config.default_provider || Object.keys(config.providers || {})[0];
  var prov = config.providers && config.providers[providerKey];
  if (!prov) return Bot.sendMessage('لا يوجد مزود مكوّن بعد. الرجاء الاتصال بالمطور.');

  var country = (prov.countries || []).find(function(c) {
    return String(c.code).toLowerCase() === String(code).toLowerCase();
  });
  if (!country) {
    return Bot.sendMessage('البلد غير متوفر أو رمز غير صحيح. استخدم /buy لعرض الدول.');
  }

  var confirmButtons = [
    [
      { text: '✅ تأكيد الشراء', callback_data: 'confirm_buy:' + providerKey + ':' + country.code },
      { text: '❌ إلغاء', callback_data: 'back' }
    ]
  ];

  return safeSendKeyboard(
    '⚠️ ستقوم بمحاولة شراء رقم حقيقي لبلد: ' + country.name +
    '\nالسعر: ' + country.price + ' ' + currency +
    '\n\nهل تريد المتابعة؟',
    confirmButtons
  );
}

// -------- Show list of countries --------
var rows = [];
var providerKeys = Object.keys(config.providers || {});
if (providerKeys.length === 0) {
  return Bot.sendMessage('لا توجد دول مهيّأة في الإعدادات.');
}

var defaultProv = config.default_provider || providerKeys[0];
var prov = config.providers[defaultProv];

(prov.countries || []).forEach(function(c) {
  if (!c.enabled) return;
  rows.push([
    { text: c.name + ' - ' + c.price + ' ' + currency, callback_data: 'buycountry:' + c.code }
  ]);
});

if (rows.length === 0) {
  return Bot.sendMessage('لا توجد دول متاحة للشراء.');
}

return safeSendKeyboard('اختر الدولة لشراء رقم من ' + currency, rows);