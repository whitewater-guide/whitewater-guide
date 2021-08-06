import { compare } from 'bcrypt';
import { Strategy } from 'passport-local';

import { db, Sql } from '~/db';

export const localSignInStrategy = new Strategy(
  { usernameField: 'email', session: false },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (username, password, done) => {
    const email = username.toLowerCase();
    const user: Sql.Users | undefined = await db()
      .select('*')
      .from('users')
      .where({ email: email.toLowerCase() })
      .first();
    if (!user) {
      return done(null, false, {
        message: 'signin.errors.email.not_found',
        payload: { email },
      });
    }
    if (!user.password) {
      // user only logged in via facebook before and has no password
      return done(null, false, {
        message: 'signin.errors.email.not_local',
        payload: { email, id: user.id },
      });
    }
    try {
      const passwordMatches = await compare(password, user.password);
      if (passwordMatches) {
        return done(null, user);
      }
      return done(null, false, {
        message: 'signin.errors.password.mismatch',
        payload: { email, id: user.id },
      });
    } catch (e) {
      return done(null, false, {
        message: 'signin.errors.password.error',
        payload: { email, id: user.id },
      });
    }
  },
);
