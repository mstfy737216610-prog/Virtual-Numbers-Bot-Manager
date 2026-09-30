import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config.js';
import { schemaSql } from './schema.js';

const dbDir = path.dirname(config.DB_PATH);
fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(config.DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(schemaSql);

const seed = () => {
  const providerCount = db.prepare('SELECT COUNT(*) AS c FROM providers').get().c;
  if (!providerCount) {
    db.prepare(`INSERT INTO providers (name, code, enabled) VALUES (?, ?, 1)`).run('Demo Provider', 'demo');
  }

  const appCount = db.prepare('SELECT COUNT(*) AS c FROM apps').get().c;
  if (!appCount) {
    const demoProvider = db.prepare('SELECT id FROM providers WHERE code = ?').get('demo');
    if (demoProvider) {
      db.prepare(`INSERT INTO apps (provider_id, code, name, enabled) VALUES (?, ?, ?, 1)`).run(demoProvider.id, 'wa', 'WhatsApp', 1);
      db.prepare(`INSERT INTO apps (provider_id, code, name, enabled) VALUES (?, ?, ?, 1)`).run(demoProvider.id, 'tg', 'Telegram', 1);
    }
  }

  const countryCount = db.prepare('SELECT COUNT(*) AS c FROM countries').get().c;
  if (!countryCount) {
    db.prepare(`INSERT INTO countries (code, name) VALUES (?, ?)`).run('us', 'United States');
    db.prepare(`INSERT INTO countries (code, name) VALUES (?, ?)`).run('eg', 'Egypt');
    db.prepare(`INSERT INTO countries (code, name) VALUES (?, ?)`).run('sa', 'Saudi Arabia');
  }

  const settingsCount = db.prepare('SELECT COUNT(*) AS c FROM settings').get().c;
  if (!settingsCount) {
    db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`).run('app_name', config.APP_NAME);
    db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)`).run('default_admin', config.DEFAULT_ADMIN);
  }
};

seed();

export function getDb() {
  return db;
}

export default db;
