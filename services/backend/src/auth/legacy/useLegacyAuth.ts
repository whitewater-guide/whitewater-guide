import Koa from 'koa';
import passport from 'koa-passport';
import usePassport from './passport';
import router from './router';
import { useSessions } from './sessions';

export const useLegacyAuth = (app: Koa) => {
  useSessions(app);

  app.use(passport.initialize());
  app.use(passport.session());

  usePassport();

  app.use(router.routes());
};
