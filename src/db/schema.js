export const schemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT UNIQUE,
  username TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  balance REAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_servers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT,
  base_url TEXT,
  config_json TEXT DEFAULT '{}',
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(provider_id) REFERENCES providers(id)
);

CREATE TABLE IF NOT EXISTS apps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider_id, code),
  FOREIGN KEY(provider_id) REFERENCES providers(id)
);

CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  app_id INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  operator TEXT,
  price REAL NOT NULL,
  enabled INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(provider_id) REFERENCES providers(id),
  FOREIGN KEY(app_id) REFERENCES apps(id)
);

CREATE TABLE IF NOT EXISTS channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'telegram',
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  provider_id INTEGER,
  app_id INTEGER,
  country_code TEXT,
  operator TEXT,
  phone TEXT,
  external_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'success',
  meta TEXT DEFAULT '{}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_prices_lookup ON prices(provider_id, app_id, country_code, operator);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, status);
`;
