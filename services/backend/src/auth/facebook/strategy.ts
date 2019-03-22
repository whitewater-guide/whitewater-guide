import FacebookTokenStrategy from 'passport-facebook-token';
import { MailType, sendMail } from '../mail';
import getFBUser from './getFBUser';
import logger from './logger';

export const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env.FB_APP_ID!,
    clientSecret: process.env.FB_SECRET!,
    profileFields: ['name', 'email', 'picture', 'link', 'locale'],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const { isNew, user } = await getFBUser(
        'facebook',
        profile,
        {
          accessToken,
          refreshToken,
        },
        req,
      );
      if (user && user.email && isNew) {
        try {
          await sendMail(MailType.WELCOME_VERIFIED, user.email, {
            user: { id: user.id, name: user.name || '' },
          });
        } catch (e) {
          logger.error(
            {
              email: user.email,
              error: e.message,
            },
            'signup.send.verification.error',
          );
        }
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);