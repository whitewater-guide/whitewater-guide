import { useLegacyAuth } from '@auth';
import { addPingRoute } from '@utils';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { corsMiddleware } from './cors';

export const createApp = () => {
  const app = new Koa();
  app.silent = true;

  app.use(corsMiddleware);

  app.use(bodyParser());
  useLegacyAuth(app);

  addPingRoute(app);

  return app;
};
