import { init as initSentry } from '@sentry/node';

import { db, waitForDb } from '~/db';
import { initIAP } from '~/features/purchases';
import log from '~/log';

import { createApolloServer } from './apollo/server';
import { createApp } from './app';
import config from './config';
import { synapseClient } from './features/chats';
import startServer from './server';

async function startup() {
  log.info('starting');
  await waitForDb();
  log.info('waiting for synapse');
  await synapseClient.waitForSynapse();
  log.info('connected to synapse');

  if (config.SENTRY_DSN) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pjson = require('../package.json');
    initSentry({
      dsn: config.SENTRY_DSN,
      release: pjson.version,
      integrations: (integrations) =>
        // integrations will be all default integrations
        integrations.filter(
          (integration) => integration.name !== 'Breadcrumbs',
        ),
    });
  }
  let dbVersion = await db(true).migrate.currentVersion();
  log.info(`Migrating from ${dbVersion}`);
  await db(true).migrate.latest();
  dbVersion = await db(true).migrate.currentVersion();
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
