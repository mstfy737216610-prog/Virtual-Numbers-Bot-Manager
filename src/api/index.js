import './config.js';
import db from './db/index.js';
import { startBot } from './bot/index.js';
import { startApi } from './api/index.js';
import { config } from './config.js';

const app = startApi();
startBot();

app.listen(config.PORT, () => {
  console.log(`Server listening on http://localhost:${config.PORT}`);
  console.log(`Bot app started.`);
});
