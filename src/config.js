import dotenv from 'dotenv';
dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  DB_PATH: process.env.DB_PATH || 'data/app.db',
  PORT: Number(process.env.PORT || 3000),
  APP_NAME: process.env.APP_NAME || 'Next Plus BOT',
  DEFAULT_ADMIN: process.env.DEFAULT_ADMIN || '8338869162'
};
