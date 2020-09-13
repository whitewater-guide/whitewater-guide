import { init as initSentry } from '@sentry/node';

import db, { waitForDb } from '~/db';
import { initIAP } from '~/features/purchases';
import log from '~/log';

import { createApolloServer } from './apollo/server';
import { createApp } from './app';
import startServer from './server';

async function startup() {
  await waitForDb();
  if (process.env.SENTRY_DSN) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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
