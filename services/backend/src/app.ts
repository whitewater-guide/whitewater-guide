import { useAuthMiddleware } from '@auth';
import { addPingRoute } from '@utils';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { createApolloServer } from './apollo/server';
import { corsMiddleware } from './cors';

export const createApp = async () => {
  const app = new Koa();
  app.silent = true;

  app.use(corsMiddleware);

  app.use(bodyParser());
  useAuthMiddleware(app);

  await createApolloServer(app as any);

  addPingRoute(app);

  return app;
};
