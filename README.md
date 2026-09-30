# Virtual Numbers Bot - بوتي بوتي بوتي

هذا المستودع مُعدّ لتشغيل بوت أرقام وهمية على منصة Bot Business.

الملفات المهمة:
- commands/   : أوامر البوت (start, buy, admin ...)
- libs/SMSProvider.js : غلاف موحد لمزوّدي SMS (HeroSMS, Spark, 5sim)
- data/config.json : إعدادات الدول والمزوّدين (لاحظ: لا تحفظ مفاتيح هنا في الإنتاج)

التثبيت السريع على Bot Business:
1. استورد المستودع واختر الفرع main.
2. داخل Console (كمشرف) نفّذ السكربت setup_providers_secure.js لوضع مفاتيح الـ API بأمان.
3. اختبر الأوامر: /start, /buy, /check_sms

أمان:
- لا تضع المفاتيح أو توكين البوت في الملفات العامة. استخدم Bot.setProperty أو متغيرات البيئة.

