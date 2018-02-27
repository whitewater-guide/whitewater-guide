import db from './db';
import log from './log';
import startServer from './server';

async function startup() {
  await db(true).migrate.latest();
  await db(true).seed.run();
  const dbVersion = await db(true).migrate.currentVersion();
  log.info(`Current DB version: ${dbVersion}`);
  startServer();
}

startup();
