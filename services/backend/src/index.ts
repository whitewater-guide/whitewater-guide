// tslint:disable:no-submodule-imports no-var-requires
// @ts-ignore
require('module-alias/register');

import db from '@db';
import { startupJobs } from '@features/jobs';
import { initIAP } from '@features/purchases';
import log from '@log';
import { initMinio } from '@minio';
import { createApp } from './app';
import startServer from './server';

async function startup() {
  await db(true).migrate.latest();
  const dbVersion = await db(true).migrate.currentVersion();
  log.info(`Current DB version: ${dbVersion}`);
  await initMinio();
  const app = await createApp();
  startServer(app);
  await startupJobs();
  await initIAP();
  log.info('Startup complete');
}

startup();
