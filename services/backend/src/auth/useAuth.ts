import Koa from 'koa';
import { initFacebookRouter } from './facebook';
import { fcmRouter } from './fcm';
import initPassport from './initPassport';
import { authenticateWithJWT, initJwtRouter } from './jwt';
import { initLocalRouter } from './local/router';
import { logoutRouter } from './logout';

export const useAuth = (app: Koa) => {
  const passport = initPassport();
  app.use(passport.initialize());

  const jwtRouter = initJwtRouter();
  const fbRouter = initFacebookRouter(passport);
  const localRouter = initLocalRouter(passport);

  app.use(jwtRouter.routes());
  app.use(fbRouter.routes());
  app.use(localRouter.routes());

  app.use(authenticateWithJWT(passport));
  app.use(logoutRouter.routes());
  app.use(fcmRouter.routes());
};
