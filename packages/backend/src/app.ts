import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { useAuth } from '~/auth';
import db from '~/db';
import log from '~/log';
import { addPingRoute } from '~/utils';

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useAuth(app);

  addPingRoute(app);

  return Object.assign(app, {
    shutdown: () => Promise.all([db(true).destroy()]),
  });
};
