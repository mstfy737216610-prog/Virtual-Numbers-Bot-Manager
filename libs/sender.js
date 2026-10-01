// libs/sender.js
// Safe inline keyboard sender for Bots.Business

function safeStringifyReplyMarkup(buttons) {
  try {
    var cleaned = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function')
      ? libs.keyboard.cleanKeyboard(buttons)
      : (buttons || []);

    return JSON.stringify({ inline_keyboard: cleaned });
  } catch (e) {
    return JSON.stringify({ inline_keyboard: [] });
  }
}

function sendInlineKeyboard(text, buttons, opts) {
  opts = opts || {};
  var parse_mode = opts.parse_mode || undefined;

  // تنظيف الأزرار
  var cleaned = (libs && libs.keyboard && typeof libs.keyboard.cleanKeyboard === 'function')
    ? libs.keyboard.cleanKeyboard(buttons)
    : (buttons || []).map(function(row) {
        return (row || []).filter(function(b) {
          return b && b.text && (b.callback_data || b.url);
        });
      }).filter(function(r) { return r && r.length > 0; });

  // إذا لا توجد أزرار، أرسل النص فقط
  if (!cleaned || !cleaned.length) {
    return Bot.sendMessage(text);
  }

  // ✅ الطريقة الصحيحة لـ Bots.Business
  try {
    var params = {
      reply_markup: JSON.stringify({ inline_keyboard: cleaned })
    };
    if (parse_mode) params.parse_mode = parse_mode;

    return Bot.sendMessage(text, params);
  } catch (e) {
    return Bot.sendMessage(text);
  }
}

publish({
  sendInlineKeyboard: sendInlineKeyboard,
  safeStringifyReplyMarkup: safeStringifyReplyMarkup
});
