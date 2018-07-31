import { useAuthMiddleware } from '@auth';
import cors from '@koa/cors';
import log from '@log';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { createApolloServer } from './apollo/server';
import getOrigin from './auth/getOrigin';

export const createApp = async () => {

  const app = new Koa();
  app.silent = true;

  const CORS_WHITELIST = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST!.split(',') : [];

  app.use(cors({
    credentials: true,
    origin: (ctx) => {
      const originIndex = ctx.req.rawHeaders.indexOf('Origin');
      if (originIndex === -1) {
        return true;
      }
      const origin = ctx.req.rawHeaders[originIndex + 1];
      if (!origin) {
        return true;
      }
      if (CORS_WHITELIST.includes(getOrigin(origin))) {
        return origin;
      } else {
        log.error({ origin }, 'Invalid CORS origin');
        ctx.throw(new Error(`${origin} is not a valid origin`));
      }
      return false;
    },
  }));

  app.use(bodyParser());
  useAuthMiddleware(app);

  await createApolloServer(app as any);
  return app;
};
