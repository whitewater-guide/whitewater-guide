import { Strategy as FacebookStrategy } from 'passport-facebook';
import loginWithFacebook from './loginWithFacebook';

const FacebookWebStrategy = new FacebookStrategy(
  {
    clientID: process.env.FB_APP_ID!,
    clientSecret: process.env.FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await loginWithFacebook(req as any, 'facebook', profile, { accessToken, refreshToken });
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

export default FacebookWebStrategy;
