import FacebookTokenStrategy from 'passport-facebook-token';

import { sendWelcome } from '../mail';
import getFBUser from './getFBUser';

export const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env.FB_APP_ID!,
    clientSecret: process.env.FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { isNew, user } = await getFBUser(profile, req);
      if (user && isNew) {
        await sendWelcome(user);
      }
      done(null, user, { isNew });
    } catch (err) {
      done(err);
    }
  },
);
