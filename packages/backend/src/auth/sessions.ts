import connectRedis from 'connect-redis';
import session from 'express-session';
import { redis } from '../redis';

export const sessionMiddleware = () => {
  const RedisStore = connectRedis(session);
  const store = new RedisStore({
    client: redis as any,
  });

  return session({
    store,
    name: 'sid',
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET!,
  });
};
