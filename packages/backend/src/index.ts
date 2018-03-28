import db from './db';
import { startupJobs } from './features/jobs';
import log from './log';
import { initMinio } from './minio';
import startServer from './server';
import { isMaster } from './utils';

// TODO: BUGWATCH: https://github.com/Microsoft/TypeScript/issues/22949
// Set "noEmitHelpers": true in tsconfig

async function startup() {
  await db(true).migrate.latest();
  const dbVersion = await db(true).migrate.currentVersion();
  log.info(`Current DB version: ${dbVersion}`);
  if (process.env.AUTO_SEED === 'true' && isMaster()) {
    await db(true).seed.run();
  }
  await initMinio();
  startServer();
  await startupJobs();
  log.info('Startup complete');
}

startup();
