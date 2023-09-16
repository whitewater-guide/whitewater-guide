import type { Middleware } from 'koa';

import { db } from '../../db/index';

/**
 * This middleware saves user's FCM token on sign in (if provided)
 * Token must be provided via `fcm_token` field in GET or POST
 * @param ctx
 * @param next
 */
export const fcmMiddleware: Middleware<any, any> = async (ctx, next) => {
  const token = ctx?.request?.body?.fcm_token || ctx?.query?.fcm_token;
  const old_token =
    ctx?.request?.body?.old_fcm_token || ctx?.query?.old_fcm_token;
  const user_id = ctx?.state?.user?.id;
  if (token && user_id) {
    if (old_token) {
      try {
        await db()
          .table('fcm_tokens')
          .update({ token })
          .where({ token: old_token });
        await next();
      } catch {
        /* Ignore */
      }
    }
    const query = db().insert({ user_id, token }).into('fcm_tokens').toString();
    // No await here because it should not affect the result
    Promise.resolve(db().raw(`${query} ON CONFLICT DO NOTHING`)).catch();
  }
  await next();
};
