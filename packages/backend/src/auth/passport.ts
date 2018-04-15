import passport from 'koa-passport';
import db from '../db';
import { UserRaw } from '../features/users';
import log from '../log';
import FacebookMobileStrategy from './facebook-mobile';
import FacebookWebStrategy from './facebook-web';

const usePassport = () => {
  // Which data of user should be stored in session
  passport.serializeUser((user: UserRaw, done) => {
    done(null, user.id);
  });

  // Retriever whole user by id and attach it to Koa context
  passport.deserializeUser((id, done) => {
    db().table('users').where({ id }).first()
      .then(
      (user: UserRaw) => done(null, user),
      )
      .catch((error) => {
        log.error({ id, error }, 'Failed to deserialize user');
        done(error);
      });
  });

  passport.use(FacebookWebStrategy);
  passport.use(FacebookMobileStrategy);
};

export default usePassport;
