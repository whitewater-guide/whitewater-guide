import db from '@db';
import { UserRaw } from '@features/users';
import log from '@log';
import { KoaPassport } from '../types';
import FacebookMobileStrategy from './facebook-mobile';
import FacebookWebStrategy from './facebook-web';

const initPassport = () => {
  const passport = new KoaPassport();
  // Which data of user should be stored in session
  passport.serializeUser((user: UserRaw, done) => {
    done(null, user.id);
  });

  // Retriever whole user by id and attach it to Koa context
  passport.deserializeUser((id, done) => {
    db()
      .table('users')
      .where({ id })
      .first()
      .then((user: UserRaw) => done(null, user))
      .catch((error) => {
        log.error({
          message: 'Failed to deserialize user',
          extra: { id },
          error,
        });
        done(error);
      });
  });

  passport.use('facebook-legacy', FacebookWebStrategy);
  passport.use('facebook-legacy-token', FacebookMobileStrategy);

  return passport;
};

export default initPassport();
