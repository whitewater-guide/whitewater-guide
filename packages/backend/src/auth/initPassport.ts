import { SocialMediaProvider } from '@whitewater-guide/schema';

import { apppleStrategy } from './apple';
import { facebookStrategy } from './facebook';
import { jwtStrategy } from './jwt';
import { localSignInStrategy, localSignUpStrategy } from './local';
import { KoaPassport } from './types';

const initPassport = () => {
  const passport = new KoaPassport();

  passport.use(SocialMediaProvider.APPLE, apppleStrategy);
  passport.use(SocialMediaProvider.FACEBOOK, facebookStrategy);
  passport.use('jwt', jwtStrategy);
  passport.use('local-signin', localSignInStrategy);
  passport.use('local-signup', localSignUpStrategy);

  return passport;
};

export default initPassport;
