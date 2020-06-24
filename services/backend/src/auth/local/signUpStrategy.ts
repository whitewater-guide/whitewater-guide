import db from '~/db';
import { UserRaw, UserRawInput } from '~/features/users';
import { LANGUAGES } from '@whitewater-guide/commons';
import { hash } from 'bcrypt';
import Negotiator from 'negotiator';
// tslint:disable-next-line:no-submodule-imports
import { preferredLanguages } from 'negotiator/lib/language';
import { Strategy } from 'passport-local';
import isEmail from 'validator/lib/isEmail';
import { SALT_ROUNDS } from '../constants';
import { MailType, sendMail } from '../mail';
import logger from './logger';
import { isPasswordWeak, randomToken } from './utils';

export const localSignUpStrategy = new Strategy(
  { usernameField: 'email', session: false, passReqToCallback: true },
  async (req, username, password, done) => {
    const { imperial, language, name } = req.body;
    const email = username.toLowerCase();
    if (!email || !password) {
      return done(null, false, {
        message: 'signup.errors.email.missing',
      });
    } else if (!isEmail(email)) {
      return done(null, false, {
        message: 'signup.errors.email.invalid',
        payload: { email },
      });
    } else if (isPasswordWeak(password)) {
      return done(null, false, {
        message: 'signup.errors.password.weak',
        payload: { email },
      });
    } else {
      const negotiator = new Negotiator(req);
      const hashedPassword = await hash(password, SALT_ROUNDS);
      const verificationToken = await randomToken();
      const explicitLangs = language
        ? preferredLanguages(`${language.replace('_', '-')};q=1.0`, LANGUAGES)
        : [];
      const bestLanguage = [
        ...explicitLangs,
        ...negotiator.languages(LANGUAGES),
        'en',
      ][0];
      const userInput: Partial<UserRawInput> = {
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
        language: bestLanguage,
        imperial,
      };
      let user: UserRaw;
      try {
        [user] = await db()
          .table('users')
          .insert(userInput)
          .returning('*');
      } catch (e) {
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
          error,
          extra: { email },
        });
      }
      return done(null, user);
    }
  },
);
