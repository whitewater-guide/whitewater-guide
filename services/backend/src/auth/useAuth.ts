import { SocialMediaProvider } from '@whitewater-guide/commons';
import Koa from 'koa';
import { fcmRouter } from './fcm';
import initPassport from './initPassport';
import { authenticateWithJWT, initJwtRouter } from './jwt';
import { initLocalRouter } from './local/router';
import { logoutRouter } from './logout';
import { createSocialRouter } from './social';

export const useAuth = (app: Koa) => {
  const passport = initPassport();
  app.use(passport.initialize());

  const jwtRouter = initJwtRouter();
  const fbRouter = createSocialRouter(passport, SocialMediaProvider.FACEBOOK);
  const appleRouter = createSocialRouter(
    passport,
    SocialMediaProvider.APPLE,
    'post',
  );
  const localRouter = initLocalRouter(passport);

  app.use(jwtRouter.routes());
  app.use(fbRouter.routes());
  app.use(appleRouter.routes());
  app.use(localRouter.routes());

  app.use(authenticateWithJWT(passport));
  app.use(logoutRouter.routes());
  app.use(fcmRouter.routes());
};
