import db from '../../db/index.js';
import { getProviders, getAppsByProvider, getCountryList } from '../../services/providerRegistry.js';
import { createOrder } from '../../services/orders.js';

export async function startBuy(ctx) {
  const providers = getProviders();
  const keyboard = { inline_keyboard: providers.map(p => [{ text: p.name, callback_data: `buy_provider:${p.code}` }]) };
  return ctx.reply('💰 - اختر المزود', { reply_markup: keyboard });
}

export async function providerSelected(ctx, providerCode) {
  const apps = getAppsByProvider(providerCode);
  if (!apps || apps.length === 0) return ctx.reply('⚠️ - لا توجد تطبيقات لهذا المزود');
  const keyboard = { inline_keyboard: apps.map(a => [{ text: a.name, callback_data: `buy_app:${providerCode}:${a.code}` }]).concat([[{ text: 'رجوع 🔙', callback_data: 'startup' }]]) };
  return ctx.editMessageText('📱 - اختر التطبيق', { reply_markup: keyboard });
}

export async function appSelected(ctx, providerCode, appCode) {
  const countries = getCountryList();
  const keyboard = { inline_keyboard: countries.map(c => [{ text: c.name + ' (' + c.code + ')', callback_data: `buy_country:${providerCode}:${appCode}:${c.code}` }]) };
  return ctx.editMessageText('🌍 - اختر الدولة', { reply_markup: keyboard });
}

export async function countrySelected(ctx, providerCode, appCode, countryCode) {
  const price = getPriceFor(providerCode, appCode, countryCode, 'any');
  const text = `سعر الخدمة: ${price !== null ? price + ' روبل' : 'غير متوفر'}\n\n✅ - هل تريد المتابعة؟`;
  const keyboard = { inline_keyboard: [[{ text: 'تأكيد الشراء ✅', callback_data: `buy_confirm:${providerCode}:${appCode}:${countryCode}:any` }],[{ text: 'الغاء ❌', callback_data: 'startup' }]] };
  return ctx.editMessageText(text, { reply_markup: keyboard });
}

export async function confirmBuy(ctx, providerCode, appCode, countryCode, operator) {
  const tgId = String(ctx.from.id);
  try {
    const result = await createOrder({ telegramId: tgId, providerCode, appCode, countryCode, operator });
    return ctx.editMessageText('✅ - تم إنشاء الطلب. جاري تجهيز الرقم...\nرقم الطلب: ' + result.orderId);
  } catch (e) {
    return ctx.editMessageText('❌ - فشل إنشاء الطلب: ' + (e.message || e.toString()));
  }
}
