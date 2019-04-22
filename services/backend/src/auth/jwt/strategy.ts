import { AccessTokenPayload } from '@whitewater-guide/commons';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE } from '../constants';
import cookieJWTExtractor from './cookie-jwt-extractor';
import logger from './logger';

export const jwtStrategy = new Strategy(
  {
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      cookieJWTExtractor(ACCESS_TOKEN_COOKIE),
    ]),
  },
  (token: AccessTokenPayload, done) => {
    if ((token as any).refresh) {
      logger.error({
        message: 'cannot use refresh token as access token',
        extra: { token },
      });
      return done(new Error('cannot use refresh token as access token'));
    }
    try {
      return done(null, token);
    } catch (err) {
      done(err);
    }
  },
);
