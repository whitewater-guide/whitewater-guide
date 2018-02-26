import { Request, Response, Router } from 'express';
import * as passport from 'passport';
import getLogoutRedirect from './getLogoutRedirect';
import setReturnTo from './setReturnTo';

const router = Router();

router.get(
  '/auth/facebook',
  setReturnTo,
  passport.authenticate('facebook', { scope: 'email' }),
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successReturnToOrRedirect: '/', failureRedirect: '/login' }),
);

router.get(
  '/auth/logout',
  (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        req.logout();
        res.clearCookie('sid');
        res.redirect(getLogoutRedirect(req));
      });
    }
  },
);

if (process.env.NODE_ENV !== 'production') {
  router.get('/', (req: Request, res: Response) => {
    if (req.user) {
      // tslint:disable-next-line:max-line-length
      res.send(`<p>Welcome, ${req.user.name} (<a href="javascript:fetch('/auth/logout', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">log out</a>)</p>`);
    } else {
      res.send(`<p>Welcome, guest! (<a href="/auth/facebook">log in</a>)</p>`);
    }
  });
}

export default router;
