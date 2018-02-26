import db from './db';
import startServer from './server';

async function startup() {
  await db(true).migrate.latest();
  await db(true).seed.run();
  const dbVersion = await db(true).migrate.currentVersion();
  console.info(`Current DB version: ${dbVersion}`);
  startServer();
}

startup();
