import db from '../db/index.js';

export function getProviders() {
  return db.prepare('SELECT * FROM providers WHERE enabled = 1 ORDER BY id DESC').all();
}

export function getAppsByProvider(providerCode) {
  const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
  if (!provider) return [];
  return db.prepare('SELECT * FROM apps WHERE provider_id = ? AND enabled = 1 ORDER BY id DESC').all(provider.id);
}

export function getPriceFor(providerCode, appCode, countryCode, operator = 'any') {
  const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
  if (!provider) return null;
  const app = db.prepare('SELECT id FROM apps WHERE provider_id = ? AND code = ?').get(provider.id, appCode);
  if (!app) return null;

  const row = db.prepare(`
    SELECT price
    FROM prices
    WHERE provider_id = ? AND app_id = ? AND country_code = ? AND (operator = ? OR operator = 'any') AND enabled = 1
    ORDER BY id DESC
    LIMIT 1
  `).get(provider.id, app.id, countryCode, operator || 'any');

  return row ? Number(row.price) : null;
}

export function getCountryList() {
  return db.prepare('SELECT * FROM countries ORDER BY name').all();
}

export function getChannelList() {
  return db.prepare('SELECT * FROM channels WHERE enabled = 1 ORDER BY id').all();
}

export function buildDemoNumberResponse({ countryCode, appCode, providerCode }) {
  return {
    status: 200,
    message: 'Number fetched successfully',
    number: `+${countryCode.toUpperCase()}-000000000`,
    idnumber: `${providerCode}-${appCode}-${Date.now()}`,
    time: 60 * 15,
    location: providerCode
  };
}
