import FacebookTokenStrategy from 'passport-facebook-token';
import loginWithFacebook from './loginWithFacebook';

const FacebookMobileStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env.FB_APP_ID!,
    clientSecret: process.env.FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await loginWithFacebook(profile, {
        accessToken,
        refreshToken,
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

export default FacebookMobileStrategy;
