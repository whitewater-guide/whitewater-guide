import db from '@db';
import { UserRaw } from '@features/users';
import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';

export const localSignInStrategy = new Strategy(
  { usernameField: 'email', session: false },
  async (username, password, done) => {
    const email = username.toLowerCase();
    const user: UserRaw | undefined = await db()
      .select('*')
      .from('users')
      .where({ email: email.toLowerCase() })
      .first();
    if (!user) {
      return done(null, false, {
        message: 'signin.no.user',
        payload: { email },
      });
    }
    if (!user.password) {
      // user only logged in via facebook before and has no password
      return done(null, false, {
        message: 'signin.no.local.login',
        payload: { email, id: user.id },
      });
    }
    try {
      const passwordMatches = await compare(password, user.password);
      if (passwordMatches) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'signin.password.fail',
          payload: { email, id: user.id },
        });
      }
    } catch (e) {
      return done(null, false, {
        message: 'signin.password.error',
        payload: { email, id: user.id },
      });
    }
  },
);
