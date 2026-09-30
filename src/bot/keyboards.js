export const mainKeyboard = () => ({
  inline_keyboard: [
    [{ text: 'لديكَ حساب؟ تسجيل دخول 📲', callback_data: 'login' }],
    [{ text: 'إنشاء حساب جديد ☑️', callback_data: 'signup' }],
    [{ text: 'شروط الإستخدام 🚨', callback_data: 'terms' }],
    [{ text: 'إحصائيات البوت 📊', callback_data: 'stats' }],
    [{ text: 'إدارة البوت 👨🏻‍💻', callback_data: 'admin' }]
  ]
});

export const adminKeyboard = () => ({
  inline_keyboard: [
    [{ text: 'إضافة مزود ↗️', callback_data: 'admin_add_provider' }, { text: 'إدارة المزودين 🧩', callback_data: 'admin_list_providers' }],
    [{ text: 'إضافة تطبيق 📱', callback_data: 'admin_add_app' }, { text: 'إدارة التطبيقات 🗂️', callback_data: 'admin_list_apps' }],
    [{ text: 'إضافة قناة 📢', callback_data: 'admin_add_channel' }, { text: 'إدارة القنوات 📣', callback_data: 'admin_list_channels' }],
    [{ text: 'إضافة سعر 💰', callback_data: 'admin_add_price' }, { text: 'إدارة الاسعار 💸', callback_data: 'admin_list_prices' }],
    [{ text: 'إضافة رصيد للمستخدم ➕', callback_data: 'admin_add_coin' }, { text: 'خصم رصيد 📛', callback_data: 'admin_dec_coin' }],
    [{ text: 'إحصائيات البوت 📈', callback_data: 'admin_stats' }, { text: 'رجوع 🔙', callback_data: 'startup' }]
  ]
});

export const buyKeyboard = (providers = []) => ({
  inline_keyboard: providers.map((provider) => [
    { text: provider.name, callback_data: `buy_provider:${provider.code}` }
  ])
});
