import log from '@log';
import Router from 'koa-router';
import passport from 'passport';
import getLogoutRedirect from './getLogoutRedirect';
import setReturnTo from './setReturnTo';

const router = new Router();

router.get(
  '/auth/facebook',
  setReturnTo,
  passport.authenticate('facebook', { scope: 'email' }),
);

router.get(
  '/auth/facebook/token',
  async (ctx, next) => {
    try {
      await passport.authenticate('facebook-token')(ctx, next);
    } catch (err) {
      log.error(err);
      await next();
    }
  },
  async (ctx, next) => {
    ctx.status = ctx.state && ctx.state.user ? 200 : 401;
    await next();
  },
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  }),
);

router.get('/auth/logout', async (ctx, next) => {
  if (ctx.session) {
    ctx.logout();
    ctx.cookies.set('wwguide');
    ctx.redirect(getLogoutRedirect(ctx));
    ctx.session = null as any;
  }
  await next();
});

if (process.env.NODE_ENV !== 'production') {
  router.get('/auth/facebook/check', async (ctx, next) => {
    ctx.body = 'It works!';
    await next();
  });

  router.get('/', async (ctx, next) => {
    // tslint:disable-next-line:prefer-conditional-expression
    if (ctx.user) {
      // tslint:disable-next-line:max-line-length
      ctx.body = `<p>Welcome, ${
        ctx.user.name
      } (<a href="javascript:fetch('/auth/logout', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">log out</a>)</p>`;
    } else {
      ctx.body = `<p>Welcome, guest! (<a href="/auth/facebook">log in</a>)</p>`;
    }
    await next();
  });
}

export default router;
