// libs/sender.js
// Cross-runtime safe wrapper for Telegram inline keyboards.
// Some Bot Business runtimes do not provide Api.sendInlineKeyboard.

function safeStringifyReplyMarkup(buttons) {
  try {
    var cleaned = (libs && libs.keyboard && libs.keyboard.cleanKeyboard)
      ? libs.keyboard.cleanKeyboard(buttons)
      : (buttons || []).map(function(row){ return (row||[]).filter(function(b){ return b && (b.text || b.url || b.callback_data); }); }).filter(function(r){ return r && r.length > 0; });
    return JSON.stringify({ inline_keyboard: cleaned });
  } catch (e) {
    return JSON.stringify({ inline_keyboard: [] });
  }
}

function sendInlineKeyboard(text, buttons, opts) {
  opts = opts || {};
  var parse_mode = opts.parse_mode || undefined;

  var cleaned = (libs && libs.keyboard && libs.keyboard.cleanKeyboard)
    ? libs.keyboard.cleanKeyboard(buttons)
    : (buttons || []).map(function(row){ return (row||[]).filter(function(b){ return b && (b.text || b.url || b.callback_data); }); }).filter(function(r){ return r && r.length > 0; });

  try {
    if (Api && typeof Api.sendInlineKeyboard === 'function') {
      var p = { buttons: cleaned, text: text };
      if (parse_mode) p.parse_mode = parse_mode;
      return Api.sendInlineKeyboard(p);
    }
  } catch (e) {}

  try {
    if (Api && typeof Api.sendMessage === 'function') {
      var payload = { reply_markup: safeStringifyReplyMarkup(cleaned) };
      if (parse_mode) payload.parse_mode = parse_mode;
      return Api.sendMessage(text, payload);
    }
  } catch (e) {}

  try {
    if (Bot && typeof Bot.sendMessage === 'function') {
      return Bot.sendMessage(text);
    }
  } catch (e) {}

  return { ok: false, error: 'no_inline_keyboard_sender_available' };
}

publish({ sendInlineKeyboard: sendInlineKeyboard, safeStringifyReplyMarkup: safeStringifyReplyMarkup });
