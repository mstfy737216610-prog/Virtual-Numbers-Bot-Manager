import { config } from './config.js';
import { startApi } from './api/index.js';
import { startBot } from './bot/index.js';

const app = startApi();
startBot();

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
  console.log(`Bot started on Telegram.`);
});
