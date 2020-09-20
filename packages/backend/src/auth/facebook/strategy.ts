import FacebookTokenStrategy from 'passport-facebook-token';

import config from '~/config';

import { sendWelcome } from '../mail';
import getFBUser from './getFBUser';

export const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: config.FB_APP_ID,
    clientSecret: config.FB_SECRET,
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
