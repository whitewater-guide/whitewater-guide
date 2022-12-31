import { SocialMediaProvider } from '@whitewater-guide/schema';
import * as express from 'express';
import jwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import config from '~/config';
import { sendWelcome } from '~/mail';

import { negotiateLanguage, storeUser } from '../social';

interface AuthToken {
  sub?: string;
  email: string;
  given_name: string;
  family_name: string;
  name: string;
  picture?: string;
}

async function getFBUser(profile: AuthToken, req: any) {
  if (!profile.sub) {
    throw new Error('sub not specified');
  }
  const language = negotiateLanguage(req, []);
  return storeUser(
    SocialMediaProvider.FACEBOOK,
    {
      id: profile.sub,
      // do not use ??, because we do not want empty string emails
      email: profile.email || null,
      username: profile.name,
      displayName: profile.name,
      profile: { picture: profile.picture },
    },
    language,
  );
}

const limitedStrategy = new Strategy(
  {
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
    secretOrKeyProvider: jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://www.facebook.com/.well-known/oauth/openid/jwks/',
    }),
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('auth_token'),
    passReqToCallback: true,
    audience: config.FB_APP_ID,
    issuer: 'https://www.facebook.com',
  },
  async (req: express.Request, token: AuthToken, done: VerifiedCallback) => {
    try {
      const { isNew, user } = await getFBUser(token, req);
      if (user && isNew) {
        await sendWelcome(user);
      }
      done(null, user, { isNew });
    } catch (err) {
      done(err);
    }
  },
);

export default limitedStrategy;
