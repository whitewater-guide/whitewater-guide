import db from '@db';
import { Middleware } from 'koa';
import get from 'lodash/get';

/**
 * This middleware saves user's FCM token on sign in (if provided)
 * Token must be provided via `fcm_token` field in GET or POST
 * @param ctx
 * @param next
 */
export const fcmMiddleware: Middleware<any, any> = async (ctx, next) => {
  const token =
    get(ctx, 'request.body.fcm_token') || get(ctx, 'query.fcm_token');
  const user_id = get(ctx, 'state.user.id');
  if (token && user_id) {
    const query = db()
      .insert({ user_id, token })
      .into('fcm_tokens')
      .toString();
    // No await here because it should not affect the result
    Promise.resolve(db().raw(`${query} ON CONFLICT DO NOTHING`)).catch();
  }
  await next();
};
