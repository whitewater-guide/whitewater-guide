import Router from 'koa-router';

import type { KoaPassport } from '../../types';
import { errorBodyMiddleware, fcmMiddleware } from '../../utils/index';
import reset from './reset';
import resetRequest from './resetRequest';
import signIn from './signin';
import signUp from './signup';
import verification from './verification';
import verificationRequest from './verificationRequest';

export function initLocalRouter(passport: KoaPassport): Router {
  const router = new Router({
    prefix: '/auth/local',
  });

  router.use(errorBodyMiddleware('local'));
  router.post('/signin', signIn(passport), fcmMiddleware);
  router.post('/signup', signUp(passport), fcmMiddleware);
  router.post('/reset/request', resetRequest);
  router.get('/reset/callback', async (ctx, next) => {
    // TODO: implement proper password reset form, see #379
    ctx.body =
      'Please open this link on mobile device where whitewater.guide app is installed';
    await next();
  });
  router.post('/reset', reset);
  router.post('/verification/request', verificationRequest);
  // Links from emails are GET
  router.get('/verification', verification);

  return router;
}
