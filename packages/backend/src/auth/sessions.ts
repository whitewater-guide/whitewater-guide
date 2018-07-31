import { client } from '@redis';
import Koa from 'koa';
import redisStore from 'koa-redis';
import session from 'koa-session';

export const useSessions = (app: Koa) => {
  const store = redisStore({ client });
  app.keys = [process.env.SESSION_SECRET!];
  const sessionMiddleware = session(
    {
      store,
      key: 'wwguide',
      maxAge: 31 * 24 * 60 * 60 * 1000, // 1 month
      renew: true,
    },
    app,
  );
  app.use(sessionMiddleware);
};
