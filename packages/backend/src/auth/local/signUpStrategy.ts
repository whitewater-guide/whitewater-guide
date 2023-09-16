import { hash } from '@node-rs/bcrypt';
import { Strategy } from 'passport-local';
import type { Overwrite } from 'utility-types';

import type { Sql } from '../../db/index';
import { db } from '../../db/index';
import { MailType, sendMail } from '../../mail/index';
import { isEmail } from '../../utils/index';
import { SALT_ROUNDS } from '../constants';
import { negotiateLanguage } from '../utils/index';
import logger from './logger';
import { isPasswordWeak, randomToken } from './utils/index';

export const localSignUpStrategy = new Strategy(
  { usernameField: 'email', session: false, passReqToCallback: true },
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req, username, password, done) => {
    const { imperial, name } = req.body;
    const email = username.toLowerCase();
    if (!email || !password) {
      return done(null, false, {
        message: 'signup.errors.email.missing',
      });
    }
    if (!isEmail(email)) {
      return done(null, false, {
        message: 'signup.errors.email.invalid',
        payload: { email },
      });
    }
    if (isPasswordWeak(password)) {
      return done(null, false, {
        message: 'signup.errors.password.weak',
        payload: { email },
      });
    }
    const language = negotiateLanguage(req);
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const verificationToken = await randomToken();
    const userInput: Overwrite<Partial<Sql.Users>, { tokens: string }> = {
      email,
      password: hashedPassword,
      tokens: JSON.stringify([
        {
          claim: 'verification',
          expires: verificationToken.expires,
          value: verificationToken.encrypted,
        },
      ]),
      name,
      language: language as Sql.Lang,
      imperial,
    };
    let user: Sql.Users;
    try {
      [user] = await db().table('users').insert(userInput).returning('*');
    } catch (e: any) {
      return done(null, false, {
        message: 'signup.errors.email.unavailable',
        payload: { email, code: e.code },
      });
    }

    try {
      await sendMail(MailType.WELCOME_UNVERIFIED, email, {
        user: { id: user.id, name: user.name || '' },
        token: verificationToken,
      });
    } catch (error) {
      logger.error({
        message: 'signup.send.verification.error',
        error: error as Error,
        extra: { email },
      });
    }
    return done(null, user);
  },
);
