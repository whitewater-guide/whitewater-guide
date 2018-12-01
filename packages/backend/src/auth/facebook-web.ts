import { Strategy as FacebookStrategy } from 'passport-facebook';
import loginWithFacebook from './loginWithFacebook';

const { FB_APP_ID, FB_SECRET, PROTOCOL, APP_DOMAIN } = process.env;

const FacebookWebStrategy = new FacebookStrategy(
  {
    clientID: FB_APP_ID!,
    clientSecret: FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    callbackURL: `${PROTOCOL}://${APP_DOMAIN}/auth/facebook/callback`,
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
