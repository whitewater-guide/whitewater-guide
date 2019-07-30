import { redis } from '@redis';
import Koa from 'koa';
import redisStore from 'koa-redis';
import session from 'koa-session';
import castArray from 'lodash/castArray';
import get from 'lodash/get';

export const useSessions = (app: Koa) => {
  const store = redisStore({ client: redis });
  app.keys = [process.env.SESSION_SECRET!];
  const sessionMiddleware = session(
    {
      store,
      key: 'wwguide',
      maxAge: 31 * 24 * 60 * 60 * 1000, // 1 month
      rolling: true,
      renew: true,
    },
    app,
  );
  app.use(sessionMiddleware);
};

const COOKIE_REGEXP = /wwguide=([\w\-]*)/;

export const extractSessionId = (resp: any): string | undefined => {
  const cookieHeader = get(resp, 'header.set-cookie');
  if (!cookieHeader) {
    return undefined;
  }
  const cookies = castArray(cookieHeader);
  for (const cookie of cookies) {
    const result = cookie.match(COOKIE_REGEXP);
    if (result && result.length >= 2) {
      return result[1];
    }
  }
  return undefined;
};
