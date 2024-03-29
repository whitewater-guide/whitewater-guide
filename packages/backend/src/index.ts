import http from 'node:http';

import { init as initSentry } from '@sentry/node';

import { createApolloServer } from './apollo/server/index';
import { createApp } from './app';
import config from './config';
import { db, waitForDb } from './db/index';
import { synapseClient } from './features/chats/index';
import log from './log/index';

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
  const httpServer = http.createServer(app.callback());
  await createApolloServer(app, httpServer);
  log.info('Startup complete');
  await new Promise<void>((resolve) => {
    httpServer.listen({ host: '0.0.0.0', port: 3333 }, resolve);
  });
}

startup().catch((err) => {
  log.error(err);
  process.exit(1);
});
