import Router from 'koa-router';
import { clearCookies, getLogoutRedirect } from './utils';

export const logoutRouter = new Router();

logoutRouter.get('/auth/logout', async (ctx, next) => {
  clearCookies(ctx);
  if (ctx.session) {
    ctx.logout();
    ctx.cookies.set('wwguide');
    ctx.redirect(getLogoutRedirect(ctx));
    ctx.session = null as any;
  }
  await next();
});
