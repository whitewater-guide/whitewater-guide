import Router from 'koa-router';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';
import { getLogoutRedirect } from './utils';

export const logoutRouter = new Router();

logoutRouter.get('/auth/logout', async (ctx, next) => {
  if (ctx.cookies.get(ACCESS_TOKEN_COOKIE)) {
    ctx.cookies.set(ACCESS_TOKEN_COOKIE);
    ctx.cookies.set(REFRESH_TOKEN_COOKIE, undefined, {
      httpOnly: true,
      path: '/auth/jwt/refresh',
      signed: false,
    });
  }
  if (ctx.session) {
    ctx.logout();
    ctx.cookies.set('wwguide');
    ctx.redirect(getLogoutRedirect(ctx));
    ctx.session = null as any;
  }
  await next();
});
