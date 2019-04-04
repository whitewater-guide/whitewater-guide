import { AuthPayload } from '@whitewater-guide/commons';
import Koa from 'koa';
import Router from 'koa-router';
import { sendCredentials } from '../jwt';
import { KoaPassport } from '../types';
import { setReturnTo } from '../utils';
import logger from './logger';

export const initFacebookRouter = (passport: KoaPassport) => {
  const router = new Router({
    prefix: '/auth/facebook',
  });

  const fail = (ctx: Partial<Koa.Context>, error: string) => {
    ctx.status = 401;
    const body: AuthPayload = {
      success: false,
      error,
    };
    ctx.body = body;
    logger.error(body.error!);
  };

  router.get('/signin', setReturnTo, async (ctx, next) => {
    await passport.authenticate(
      'facebook',
      { session: false },
      async (err, user) => {
        if (err || !user) {
          fail(ctx, 'token auth failed');
          return;
        }

        sendCredentials(ctx, user);
      },
    )(ctx, next);
  });

  return router;
};
