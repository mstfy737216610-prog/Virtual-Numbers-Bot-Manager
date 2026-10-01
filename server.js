import { startApi, startBot } from './src/bot/index.js';
import { config } from './src/config.js';

async function main() {
  const app = startApi();
  const port = config.PORT || 3000;

  app.listen(port, () => {
    console.log(`HTTP server listening on ${port}`);
  });

  await startBot();
}

main().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
