import { AuthBody } from '@whitewater-guide/commons';
import Router from 'koa-router';
import { sendCredentials } from '../jwt';
import { KoaPassport } from '../types';
import { fcmMiddleware, setReturnTo } from '../utils';
import logger from './logger';

export const initFacebookRouter = (passport: KoaPassport) => {
  const router = new Router({
    prefix: '/auth/facebook',
  });

  router.get(
    '/signin',
    setReturnTo,
    async (ctx, next) => {
      await passport.authenticate(
        'facebook',
        { session: false },
        async (err, user, info) => {
          if (err || !user) {
            ctx.status = 401;
            const body: AuthBody = {
              success: false,
              error: 'token auth failed',
            };
            ctx.body = body;
            logger.error({ message: 'token auth failed', error: err });
            return;
          }
          const isNew = info ? info.isNew : undefined;
          sendCredentials(ctx, user, isNew);
        },
      )(ctx, next);
      await next();
    },
    fcmMiddleware,
  );

  return router;
};
