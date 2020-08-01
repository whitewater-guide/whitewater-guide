// tslint:disable:no-submodule-imports no-var-requires
// @ts-ignore
require('module-alias/register');

import { createApolloServer } from './apollo/server';
import { createApp } from './app';
import db from '~/db';
import { initIAP } from '~/features/purchases';
import { initMinio } from '~/minio';
import { init as initSentry } from '@sentry/node';
import log from '~/log';
import startServer from './server';

async function startup() {
  if (process.env.SENTRY_DSN) {
    const pjson = require('../package.json');
    initSentry({
      dsn: process.env.SENTRY_DSN,
      release: pjson.version,
      integrations: (integrations) => {
        // integrations will be all default integrations
        return integrations.filter(
          (integration) => integration.name !== 'Breadcrumbs',
        );
      },
    });
  }
  await db(true).migrate.latest();
  const dbVersion = await db(true).migrate.currentVersion();
  log.info(`Current DB version: ${dbVersion}`);
  await initMinio();
  const app = createApp();
  await createApolloServer(app);
  startServer(app);
  await initIAP();
  log.info('Startup complete');
}

startup().catch((err) => {
  log.error(err);
  process.exit(1);
});
