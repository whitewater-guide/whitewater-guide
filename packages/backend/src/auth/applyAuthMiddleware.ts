import { SocialMediaProvider } from '@whitewater-guide/schema';
import type Koa from 'koa';

import { fcmRouter } from './fcm/index';
import initPassport from './initPassport';
import { authenticateWithJWT, initJwtRouter } from './jwt/index';
import { initLocalRouter } from './local/router/index';
import { logoutRouter } from './logout';
import { createSocialRouter } from './social/index';

export function applyAuthMiddleware(app: Koa): void {
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
}
