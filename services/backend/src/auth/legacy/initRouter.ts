import Koa from 'koa';
import Router from 'koa-router';
import { KoaPassport } from '../types';
import { setReturnTo } from '../utils';

const initRouter = (passport: KoaPassport) => {
  const router = new Router();

  const legacySessionMiddleware: Koa.Middleware = async (ctx, next) => {
    if (ctx.session) {
      ctx.session.legacy = true;
    }
    await next();
  };

  router.get(
    '/auth/facebook',
    legacySessionMiddleware,
    setReturnTo,
    passport.authenticate('facebook-legacy', { scope: 'email' }),
  );

  router.get(
    '/auth/facebook/token',
    legacySessionMiddleware,
    async (ctx, next) => {
      await passport.authenticate(
        'facebook-legacy-token',
        async (err, user) => {
          ctx.status = user ? 200 : 401;
          if (user) {
            await ctx.login(user);
          }
        },
      )(ctx, next);
    },
  );

  router.get(
    '/auth/facebook/callback',
    legacySessionMiddleware,
    passport.authenticate('facebook-legacy', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login',
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    router.get('/auth/facebook/check', async (ctx, next) => {
      ctx.body = 'It works!';
      await next();
    });

    router.get('/', async (ctx, next) => {
      // tslint:disable-next-line:prefer-conditional-expression
      if (ctx.state.user) {
        // tslint:disable-next-line:max-line-length
        ctx.body = `<p>Welcome, (<a href="javascript:fetch('/auth/logout', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">log out</a>)</p>`;
      } else {
        ctx.body = `<p>Welcome, guest! (<a href="/auth/facebook">log in</a>)</p>`;
      }
      await next();
    });
  }

  return router;
};

export default initRouter;
