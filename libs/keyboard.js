// libs/keyboard.js
// Helper to clean inline keyboard arrays before sending to Telegram

function cleanKeyboard(buttons) {
  if (!buttons || !Array.isArray(buttons)) return [];
  return buttons
    .map(function(row) {
      if (!row || !Array.isArray(row)) return [];
      return row
        .map(function(b) { return b || null; })
        .filter(function(b) { return b && (b.text || b.url || b.callback_data); });
    })
    .filter(function(row) { return row && row.length > 0; });
}

publish({ cleanKeyboard: cleanKeyboard });
