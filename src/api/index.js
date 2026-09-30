import express from 'express';
import db from '../db/index.js';
import {
  getProviders,
  getAppsByProvider,
  getCountryList,
  getChannelList,
  buildDemoNumberResponse,
} from '../services/providerRegistry.js';

export function startApi() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'virtual-numbers-bot-manager' });
  });

  app.get('/api/providers', (req, res) => {
    res.json(getProviders());
  });

  app.post('/api/providers', (req, res) => {
    const { name, code } = req.body || {};
    if (!name || !code) {
      return res.status(400).json({ error: 'name and code are required' });
    }
    const exists = db.prepare('SELECT id FROM providers WHERE code = ?').get(code);
    if (exists) return res.status(409).json({ error: 'provider already exists' });

    const row = db.prepare('INSERT INTO providers (name, code, enabled) VALUES (?, ?, 1)').run(name, code);
    return res.status(201).json({ id: row.lastInsertRowid, name, code });
  });

  app.get('/api/apps', (req, res) => {
    const { providerCode } = req.query;
    if (providerCode) {
      return res.json(getAppsByProvider(String(providerCode)));
    }
    return res.json(db.prepare('SELECT * FROM apps WHERE enabled = 1 ORDER BY id DESC').all());
  });

  app.post('/api/apps', (req, res) => {
    const { providerCode, code, name } = req.body || {};
    if (!providerCode || !code || !name) {
      return res.status(400).json({ error: 'providerCode, code and name are required' });
    }
    const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
    if (!provider) return res.status(404).json({ error: 'provider not found' });

    const row = db.prepare('INSERT INTO apps (provider_id, code, name, enabled) VALUES (?, ?, ?, 1)').run(provider.id, code, name);
    return res.status(201).json({ id: row.lastInsertRowid, providerCode, code, name });
  });

  app.get('/api/prices', (req, res) => {
    const rows = db.prepare(`
      SELECT p.id, p.provider_id, pr.name AS provider_name, p.app_id, a.name AS app_name,
             p.country_code, p.operator, p.price, p.enabled
      FROM prices p
      LEFT JOIN providers pr ON pr.id = p.provider_id
      LEFT JOIN apps a ON a.id = p.app_id
      ORDER BY p.id DESC
    `).all();
    res.json(rows);
  });

  app.post('/api/prices', (req, res) => {
    const { providerCode, appCode, countryCode, operator, price } = req.body || {};
    if (!providerCode || !appCode || !countryCode || price === undefined) {
      return res.status(400).json({ error: 'providerCode, appCode, countryCode and price are required' });
    }

    const provider = db.prepare('SELECT id FROM providers WHERE code = ?').get(providerCode);
    const app = provider ? db.prepare('SELECT id FROM apps WHERE provider_id = ? AND code = ?').get(provider.id, appCode) : null;
    if (!provider || !app) return res.status(404).json({ error: 'provider or app not found' });

    const row = db.prepare('INSERT INTO prices (provider_id, app_id, country_code, operator, price, enabled) VALUES (?, ?, ?, ?, ?, 1)')
      .run(provider.id, app.id, countryCode, operator || 'any', Number(price));

    return res.status(201).json({
      id: row.lastInsertRowid,
      providerCode,
      appCode,
      countryCode,
      operator: operator || 'any',
      price: Number(price),
    });
  });

  app.get('/api/channels', (req, res) => {
    res.json(getChannelList());
  });

  app.post('/api/channels', (req, res) => {
    const { name, type } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const row = db.prepare('INSERT INTO channels (name, type, enabled) VALUES (?, ?, 1)').run(name, type || 'telegram');
    return res.status(201).json({ id: row.lastInsertRowid, name, type: type || 'telegram' });
  });

  app.get('/api/countries', (req, res) => {
    res.json(getCountryList());
  });

  app.post('/api/demo/get-number', (req, res) => {
    const { countryCode = 'us', appCode = 'wa', providerCode = 'demo' } = req.body || {};
    res.json(buildDemoNumberResponse({ countryCode, appCode, providerCode }));
  });

  return app;
}
