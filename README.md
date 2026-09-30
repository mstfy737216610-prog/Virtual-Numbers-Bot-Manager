# Virtual Numbers Bot Manager

Modern MVP for a Telegram bot that can manage:
- users and balances
- providers and provider servers
- channels
- apps/services
- country prices
- admin commands from bot
- JSON REST API for management

## Stack
- Node.js
- SQLite
- Telegraf
- Express

## Setup
1. Copy `.env.example` to `.env`
2. Fill in `BOT_TOKEN`
3. Install dependencies:
   `npm install`
4. Initialize database:
   `npm run db:init`
5. Start app:
   `npm start`

## Default admin
The default admin ID is `8338869162` and can be changed in `.env`.

## Features
- `/start` menu in Arabic
- user signup/login basics
- balance tracking
- provider management via bot/admin actions
- app management
- channel management
- pricing management
- statistics
- REST API endpoints under `/api`

## Important
Do not commit real production secrets to GitHub. Keep `BOT_TOKEN` and provider API keys in `.env` or your deployment platform's secrets manager.
