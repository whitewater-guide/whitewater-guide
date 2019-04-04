import db from '@db';
import { AccessTokenPayload } from '@whitewater-guide/commons';
import { TokenExpiredError } from 'jsonwebtoken';
import get from 'lodash/get';
import { MiddlewareFactory } from '../types';
import logger from './logger';

export const authenticateWithJWT: MiddlewareFactory = (passport) => async (
  ctx,
  next,
) => {
  if (!ctx.path.startsWith('/auth') && !get(ctx, 'session.legacy')) {
    await passport.authenticate(
      'jwt',
      { session: false },
      async (err, payload: AccessTokenPayload, info) => {
        if (info instanceof TokenExpiredError) {
          ctx.body = { success: false, error: 'jwt.expired' };
          ctx.status = 401;
          return;
        }
        if (err || (info && info.message !== 'No auth token')) {
          logger.error(
            { strategy: 'jwt', ...payload },
            get(err, 'message') || get(info, 'message'),
          );
          ctx.body = { success: false, error: 'unauthenticated' };
          ctx.status = 401;
          return;
        }

        if (payload) {
          // TODO: cache context user in redis
          const user = await db()
            .select('id', 'admin', 'language', 'verified')
            .from('users')
            .where({ id: payload.id })
            .first();
          if (user) {
            ctx.state.user = user;
          } else {
            ctx.body = { success: false, error: 'unauthenticated' };
            ctx.status = 401;
            return;
          }
        }

        await next();
      },
    )(ctx, next);
  } else {
    await next();
  }
};
