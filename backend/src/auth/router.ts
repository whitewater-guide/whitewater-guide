import { Request, Response, Router } from 'express';
import * as passport from 'passport';
import successRedirect from './succesRedirect';

const router = Router();

router.get(
  '/auth/facebook',
  successRedirect,
  passport.authenticate('facebook', { scope: 'email' }),
);

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successReturnToOrRedirect: '/', failureRedirect: '/login' }),
);

router.post(
  '/auth/logout',
  (req, res) => {
    req.logout();
    res.status(200).send('OK');
  },
);

if (process.env.NODE_ENV !== 'production') {
  router.get('/', (req: Request, res: Response) => {
    if (req.user) {
      res.send(`<p>Welcome, ${req.user.name} (<a href="javascript:fetch('/auth/logout', { method: 'POST', credentials: 'include' }).then(() => window.location = '/')">log out</a>)</p>`);
    } else {
      res.send(`<p>Welcome, guest! (<a href="/auth/facebook">log in</a>)</p>`);
    }
  });
}

export default router;
