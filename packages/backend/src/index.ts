import db from '@db';
import { startupJobs } from '@features/jobs';
import { initIAP } from '@features/purchases/init';
import log from '@log';
import { initMinio } from '@minio';
import startServer from './server';

async function startup() {
  await db(true).migrate.latest();
  const dbVersion = await db(true).migrate.currentVersion();
  log.info(`Current DB version: ${dbVersion}`);
  await initMinio();
  startServer();
  await startupJobs();
  await initIAP();
  log.info('Startup complete');
}

startup();
