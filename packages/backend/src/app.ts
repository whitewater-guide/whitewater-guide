import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';

import { applyAuthMiddleware } from '~/auth';
import { db } from '~/db';
import log from '~/log';
import { addPingRoute } from '~/utils';

import config from './config';
import { corsMiddleware } from './cors';
import { addGorgeWebhooks } from './features/gorge/webhooks';

export type App = Koa & {
  shutdown: () => Promise<any>;
};

export function createApp(): App {
  const app = new Koa();
  app.silent = true;
  app.proxy = config.NODE_ENV === 'production';
  app.on('error', (err) => log.error(err));

  app.use(corsMiddleware);
  app.use(bodyParser());
  app.use(compress());

  applyAuthMiddleware(app);

  addPingRoute(app);
  addGorgeWebhooks(app);

  return Object.assign(app, {
    shutdown: () => Promise.all([db(true).destroy()]),
  });
}
