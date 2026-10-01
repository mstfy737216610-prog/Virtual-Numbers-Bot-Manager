import dotenv from 'dotenv';
dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  DB_PATH: process.env.DB_PATH || 'data/app.db',
  PORT: Number(process.env.PORT || 3000),
  APP_NAME: process.env.APP_NAME || 'Virtual Numbers Bot Manager',
  DEFAULT_ADMIN: process.env.DEFAULT_ADMIN || '8338869162',
  ADMIN_IDS: [...new Set((process.env.ADMIN_IDS || process.env.DEFAULT_ADMIN || '8338869162')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean))]
};
