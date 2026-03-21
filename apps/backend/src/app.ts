import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';

import { applyAuthMiddleware } from './auth/index';
import config from './config';
import { corsMiddleware } from './cors';
import { db } from './db/index';
import { addGorgeWebhooks } from './features/gorge/webhooks';
import log from './log/index';
import { addPingRoute } from './utils/index';

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
