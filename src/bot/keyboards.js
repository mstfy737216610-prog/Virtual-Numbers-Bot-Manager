export const mainKeyboard = () => ({
  inline_keyboard: [
    [{ text: 'شراء رقم ☎️', callback_data: 'buy' }],
    [{ text: 'حسابي 💰', callback_data: 'balance' }, { text: 'طلباتي 🧾', callback_data: 'orders' }],
    [{ text: 'تسجيل الدخول 📲', callback_data: 'login' }],
    [{ text: 'الشروط 🚨', callback_data: 'terms' }, { text: 'الإحصائيات 📊', callback_data: 'stats' }]
  ]
});

export const adminKeyboard = () => ({
  inline_keyboard: [
    [{ text: 'المزودون 🧩', callback_data: 'admin_list_providers' }, { text: 'إضافة مزود ➕', callback_data: 'admin_help_provider' }],
    [{ text: 'السيرفرات 🖥️', callback_data: 'admin_list_servers' }, { text: 'إضافة سيرفر ➕', callback_data: 'admin_help_server' }],
    [{ text: 'التطبيقات 📱', callback_data: 'admin_list_apps' }, { text: 'إضافة تطبيق ➕', callback_data: 'admin_help_app' }],
    [{ text: 'الدول 🌍', callback_data: 'admin_list_countries' }, { text: 'إضافة دولة ➕', callback_data: 'admin_help_country' }],
    [{ text: 'الأسعار 💰', callback_data: 'admin_list_prices' }, { text: 'إضافة سعر ➕', callback_data: 'admin_help_price' }],
    [{ text: 'القنوات 📢', callback_data: 'admin_list_channels' }, { text: 'إضافة قناة ➕', callback_data: 'admin_help_channel' }],
    [{ text: 'شحن رصيد ➕', callback_data: 'admin_help_addcoin' }, { text: 'خصم رصيد ➖', callback_data: 'admin_help_delcoin' }],
    [{ text: 'الإحصائيات 📈', callback_data: 'admin_stats' }, { text: 'رجوع 🔙', callback_data: 'startup' }]
  ]
});

export const backKeyboard = (callback = 'startup') => ({
  inline_keyboard: [[{ text: 'رجو�� 🔙', callback_data: callback }]]
});
