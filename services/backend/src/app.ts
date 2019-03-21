import { useAuth, useLegacyAuth } from '@auth';
import db from '@db';
import log from '@log';
import { asyncRedis } from '@redis';
import { addPingRoute } from '@utils';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { corsMiddleware } from './cors';

export type App = Koa & {
  shutdown: () => Promise<any>;
};

export const createApp = (): App => {
  const app = new Koa();
  app.silent = true;
  app.proxy = process.env.NODE_ENV === 'production';
  app.on('error', (err) => log.error(err));

  app.use(corsMiddleware);

  app.use(bodyParser());
  useLegacyAuth(app);
  useAuth(app);

  addPingRoute(app);

  // tslint:disable-next-line:prefer-object-spread
  return Object.assign(app, {
    shutdown: () => Promise.all([asyncRedis.quit(), db(true).destroy()]),
  });
};
