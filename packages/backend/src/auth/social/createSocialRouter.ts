import { AuthBody } from '@whitewater-guide/commons';
import { SocialMediaProvider } from '@whitewater-guide/schema';
import Router from 'koa-router';

import { sendCredentials } from '../jwt';
import authLogger from '../logger';
import { KoaPassport } from '../types';
import { fcmMiddleware } from '../utils';

export function createSocialRouter(
  passport: KoaPassport,
  provider: SocialMediaProvider,
  method: 'get' | 'post' = 'get',
) {
  const router = new Router({
    prefix: `/auth/${provider}`,
  });

  router[method](
    '/signin',
    async (ctx, next) => {
      await passport.authenticate(
        provider,
        { session: false },
        (err, user, info) => {
          if (err || !user) {
            ctx.status = 401;
            const body: AuthBody = {
              success: false,
              error: 'token auth failed',
            };
            ctx.body = body;
            authLogger.error({
              message: 'token auth failed',
              extra: { provider },
              error: err,
            });
            return;
          }
          sendCredentials(ctx, user, info?.isNew);
        },
      )(ctx, next);
      await next();
    },
    fcmMiddleware,
  );

  return router;
}
