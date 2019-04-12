import db from '@db';
import { AccessTokenPayload } from '@whitewater-guide/commons';
import { TokenExpiredError } from 'jsonwebtoken';
import get from 'lodash/get';
import shortid from 'shortid';
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
          const error_id = shortid.generate();
          logger.error(
            { strategy: 'jwt', ...payload, error_id },
            get(err, 'message') || get(info, 'message'),
          );
          ctx.body = { success: false, error: 'unauthenticated', error_id };
          ctx.status = 401;
          return;
        }

        if (payload) {
          const error_id = shortid.generate();
          // TODO: cache context user in redis
          const user = await db()
            .select('id', 'admin', 'language', 'verified')
            .from('users')
            .where({ id: payload.id })
            .first();
          if (user) {
            ctx.state.user = user;
          } else {
            logger.error(
              { strategy: 'jwt', ...payload, error_id },
              'user not found',
            );
            ctx.body = { success: false, error: 'unauthenticated', error_id };
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
