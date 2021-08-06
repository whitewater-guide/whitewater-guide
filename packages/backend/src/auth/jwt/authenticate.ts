import { AccessTokenPayload } from '@whitewater-guide/commons';
import { TokenExpiredError } from 'jsonwebtoken';
import get from 'lodash/get';
import shortid from 'shortid';

import { db } from '~/db';

import { MiddlewareFactory } from '../types';
import logger from './logger';

export const authenticateWithJWT: MiddlewareFactory =
  (passport) => async (ctx, next) => {
    if (
      // logout needs to auth first to clean fcm_token
      ctx.path.startsWith('/auth/logout') ||
      !ctx.path.startsWith('/auth')
    ) {
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
            logger.error({
              message: get(err, 'message') || get(info, 'message'),
              tags: { strategy: 'jwt', error_id },
              extra: payload,
            });
            ctx.body = {
              success: false,
              error: 'jwt.unauthenticated',
              error_id,
            };
            ctx.status = 401;
            return;
          }

          if (payload) {
            const error_id = shortid.generate();
            const user = await db()
              .select('id', 'admin', 'language', 'verified')
              .from('users')
              .where({ id: payload.id })
              .first();
            if (user) {
              ctx.state.user = user;
            } else {
              logger.error({
                message: 'user not found',
                tags: { strategy: 'jwt', error_id },
                extra: payload,
              });
              ctx.body = {
                success: false,
                error: 'jwt.unauthenticated',
                error_id,
              };
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
