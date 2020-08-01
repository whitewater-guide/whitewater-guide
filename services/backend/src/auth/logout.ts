import db from '~/db';
import { Context } from 'koa';
import Router from 'koa-router';
import get from 'lodash/get';
import { clearCookies, getLogoutRedirect } from './utils';

export const logoutRouter: Router<any, Context> = new Router();

logoutRouter.get('/auth/logout', async (ctx, next) => {
  const token =
    get(ctx, 'request.body.fcm_token') || get(ctx, 'query.fcm_token');
  const user_id = get(ctx, 'state.user.id');
  if (token && user_id) {
    // No await here because it should not affect result
    Promise.resolve(
      db()
        .delete()
        .from('fcm_tokens')
        .where({ user_id, token }),
    ).catch();
  }
  clearCookies(ctx);
  if (ctx.session && !!ctx.logout) {
    ctx.logout();
    ctx.cookies.set('wwguide');
    ctx.redirect(getLogoutRedirect(ctx));
    ctx.session = null as any;
  }
  await next();
});
