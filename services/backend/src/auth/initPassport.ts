import { facebookStrategy } from './facebook';
import { jwtStrategy } from './jwt';
import { localSignInStrategy, localSignUpStrategy } from './local';
import { KoaPassport } from './types';

const initPassport = () => {
  const passport = new KoaPassport();

  passport.use('facebook', facebookStrategy);
  passport.use('jwt', jwtStrategy);
  passport.use('local-signin', localSignInStrategy);
  passport.use('local-signup', localSignUpStrategy);

  return passport;
};

export default initPassport;
