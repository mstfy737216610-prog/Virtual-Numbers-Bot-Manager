# Virtual Numbers Bot Manager

This branch adds admin commands, SMS provider wrapper, and runtime config management inside the bot.

Highlights:
- Cleaned keyboards (prevent empty {} buttons)
- libs/SMSProvider.js unified wrapper for 5sim and HeroSMS
- Admin commands to add/del countries, manage prices/channels, and simple wallet operations
- buy_number and check_sms commands to buy numbers and check status
- data/config.json seed + runtime Bot.getProperty('config') used as runtime editable config

Installation & usage
1. Create a branch or use the branch `feature/bot-improvements` (changes are on that branch).
2. Fill API keys in Bot properties or .env when deploying (FIVE_SIM_API_KEY, HEROSMS_API_KEY).
3. Optionally load data/config.json into runtime via `Bot.setProperty('config', <json>, 'json')` or use admin commands to add countries.

How to buy a number (simple flow):
- Run `/buy` to see available countries (from default provider)
- Or send `buy:<country_code>` (e.g. `buy:us`) to attempt purchase
- Use `/check_sms` to check last activation status

Admin commands examples:
- Run `addcountry` and send text `eg|Egypt|1.5` to add Egypt at price 1.5
- Run `delcountry` and send text `eg` to delete
- Run `manageprices` to list prices
- Run `managechannels` to list channels
- Run `addcoin` and send `12345|5` to add 5 units to user 12345
- Run `delcoin` similar to subtract
- Run `statsbot2` to view summary stats

Notes & next steps:
- For production, connect provider API keys via secure storage (env or Bot secrets)
- For a persistent admin panel UI, implement a web dashboard that reads/writes the runtime config (Firebase recommended)
- Improve buy flow to support provider selection and operator choices

