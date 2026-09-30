/*
  Command: buy_number
*/
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
  return { default_provider: 'herosms', providers: {} };
}

var config = loadConfig();
var text = message && message.text ? message.text.trim() : '';

if (text && text.toLowerCase().indexOf('buy:') === 0) {
  var code = text.split(':')[1];
  if (!code) return Bot.sendMessage('أدخل رمز الدولة بعد buy:, مثال: buy:us');
  var provider = config.default_provider || Object.keys(config.providers || {})[0];
  var prov = config.providers && config.providers[provider];
  if (!prov) return Bot.sendMessage('لا يوجد مزود مكوّن بعد. الرجاء الاتصال بالمطور.');
  var country = (prov.countries || []).find(function(c){ return c.code == code; });
  if (!country) return Bot.sendMessage('البلد غير متوفر أو رمز غير صحيح. استخدم /buy لعرض الدول.');

  var confirmButtons = [ [ { text: 'تأكيد الشراء', callback_data: 'confirm_buy:' + provider + ':' + country.code }, { text: 'إلغاء', callback_data: 'back' } ] ];
  var cleanedConfirm = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(confirmButtons) : (confirmButtons || []);
  try {
    if (cleanedConfirm && cleanedConfirm.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
      libs.sender.sendInlineKeyboard('⚠️ ستقوم بمحاولة شراء رقم حقيقي. هل تريد المتابعة؟', cleanedConfirm);
    } else if (Api && typeof Api.sendMessage === 'function') {
      Api.sendMessage('⚠️ ستقوم بمحاولة شراء رقم حقيقي. الرجاء تاكيد عبر الاوامر.');
    } else {
      Bot.sendMessage('⚠️ ستقوم بمحاولة شراء رقم حقيقي. الرجاء تاكيد عبر الاوامر.');
    }
  } catch (e) { Bot.sendMessage('⚠️ ستقوم بمحاولة شراء رقم حقيقي. الرجاء تاكيد عبر الاوامر.'); }
  return;
}

var rows = [];
var providerKeys = Object.keys(config.providers || {});
if (providerKeys.length == 0) return Bot.sendMessage('لا توجد دول مهيّأة في الإعدادات.');
var defaultProv = config.default_provider || providerKeys[0];
var prov = config.providers[defaultProv];
(prov.countries || []).forEach(function(c){ if (!c.enabled) return; rows.push([ { text: c.name + ' - ' + c.price + ' ' + (config.bot && config.bot.currency || 'USD'), callback_data: 'buycountry:' + c.code } ]); });
if (rows.length == 0) return Bot.sendMessage('لا توجد دول متاحة للشراء.');

var cleanedRows = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function') ? libs.keyboard.cleanKeyboard(rows) : (rows || []);
try {
  if (cleanedRows && cleanedRows.length > 0 && libs && libs.sender && typeof libs.sender.sendInlineKeyboard === 'function') {
    libs.sender.sendInlineKeyboard('اختر الدولة لشراء رقم من ' + (config.bot && config.bot.currency || 'USD'), cleanedRows);
  } else if (Api && typeof Api.sendMessage === 'function') {
    Api.sendMessage('اختر الدولة لشراء رقم من ' + (config.bot && config.bot.currency || 'USD'));
  } else {
    Bot.sendMessage('اختر الدولة لشراء رقم من ' + (config.bot && config.bot.currency || 'USD'));
  }
} catch (e) { Bot.sendMessage('اختر الدولة لشراء رقم من ' + (config.bot && config.bot.currency || 'USD')); }
