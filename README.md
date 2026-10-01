# Virtual Numbers Bot - بوت الأرقام الافتراضية

بوت تلغرام لبيع الأرقام الافتراضية، مبني على منصة Bots.Business.

---

## ✨ الميزات

- لوحة تحكم إدارية كاملة (إضافة/حذف دول، إدارة الأسعار، القنوات)
- نظام محفظة ونقاط بسيط (`addcoin` / `delcoin`)
- أمر `buy_number` لشراء الأرقام و `check_sms` للتحقق من الحالة
- `libs/SMSProvider.js` — غلاف موحّد لمزودي 5sim و HeroSMS
- `libs/keyboard.js` — تنظيف الأزرار من العناصر الفارغة `{}`
- `libs/sender.js` — إرسال آمن للـ inline keyboard في عدة بيئات تشغيل
- `data/config.json` كإعداد أولي، ثم يُدار من خلال `Bot.getProperty('config')`

---

## 🚀 تشغيل سريع

1. استورد/حدّث المستودع في لوحة Bots.Business على الفرع `main`
2. احفظ مفاتيح المزودين عبر Console باستخدام `Bot.setProperty` (لا تضع المفاتيح في المستودع)
3. اختبر الأوامر: `/start` و `/buy`

---

## 🔑 مفاتيح API

لا تُخزَّن المفاتيح في المستودع مطلقاً. استخدم إحدى الطريقتين:

**طريقة 1 — عبر Console في Bots.Business:**

```javascript
Bot.setProperty("herosms_api_key", "ضع_المفتاح_هنا", "string");
Bot.setProperty("spark_api_key", "ضع_المفتاح_هنا", "string");
Bot.setProperty("five_sim_api_key", "ضع_المفتاح_هنا", "string");