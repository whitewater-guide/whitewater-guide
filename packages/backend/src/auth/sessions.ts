import Koa from 'koa';
import redisStore from 'koa-redis';
import session from 'koa-session';
import { redis } from '../redis';

export const useSessions = (app: Koa) => {
  const store = redisStore({
    client: redis as any,
  });
  app.keys = [process.env.SESSION_SECRET!];
  app.use(session({ store, key: 'wwguide' }, app));
};
