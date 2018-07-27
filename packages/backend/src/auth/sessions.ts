import { redis } from '@redis';
import Koa from 'koa';
import redisStore from 'koa-redis';
import session from 'koa-session';

export const useSessions = (app: Koa) => {
  const store = redisStore({
    client: redis,
  });
  app.keys = [process.env.SESSION_SECRET!];
  app.use(session({ store, key: 'wwguide' }, app));
};
