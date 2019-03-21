import Koa from 'koa';
import initRouter from './initRouter';
import passport from './passport';
import { useSessions } from './sessions';

export const useLegacyAuth = (app: Koa) => {
  useSessions(app);

  app.use(passport.initialize({ userProperty: 'legacyUser' }));
  app.use(passport.session());

  const router = initRouter(passport);

  app.use(router.routes());
};
