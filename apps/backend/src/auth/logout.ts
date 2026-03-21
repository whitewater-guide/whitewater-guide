import type { Context } from 'koa';
import Router from 'koa-router';

import { db } from '../db/index';
import { clearCookies } from './utils/index';

export const logoutRouter: Router<any, Context> = new Router();

logoutRouter.get('/auth/logout', async (ctx, next) => {
  const token = (ctx?.request?.body as any)?.fcm_token || ctx?.query?.fcm_token;
  const user_id = ctx?.state?.user?.id;
  if (token && user_id) {
    // No await here because it should not affect result
    Promise.resolve(
      db().delete().from('fcm_tokens').where({ user_id, token }),
    ).catch();
  }
  clearCookies(ctx);
  await next();
});
