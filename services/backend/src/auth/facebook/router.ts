import { AuthPayload } from '@whitewater-guide/commons';
import Router from 'koa-router';
import { sendCredentials } from '../jwt';
import { KoaPassport } from '../types';
import { setReturnTo } from '../utils';
import logger from './logger';

export const initFacebookRouter = (passport: KoaPassport) => {
  const router = new Router({
    prefix: '/auth/facebook',
  });

  router.get('/signin', setReturnTo, async (ctx, next) => {
    await passport.authenticate(
      'facebook',
      { session: false },
      async (err, user) => {
        if (err || !user) {
          ctx.status = 401;
          const body: AuthPayload = {
            success: false,
            error: 'token auth failed',
          };
          ctx.body = body;
          logger.error({ message: 'token auth failed', error: err });
          return;
        }

        sendCredentials(ctx, user);
      },
    )(ctx, next);
  });

  return router;
};
