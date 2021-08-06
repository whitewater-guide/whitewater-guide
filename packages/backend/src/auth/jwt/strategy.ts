import { AccessTokenPayload } from '@whitewater-guide/commons';
import { ExtractJwt, Strategy } from 'passport-jwt';

import config from '~/config';

import { ACCESS_TOKEN_COOKIE } from '../constants';
import cookieJWTExtractor from './cookie-jwt-extractor';
import logger from './logger';

export const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  cookieJWTExtractor(ACCESS_TOKEN_COOKIE),
]);

export const jwtStrategy = new Strategy(
  {
    secretOrKey: config.ACCESS_TOKEN_SECRET,
    jwtFromRequest,
  },
  (token: AccessTokenPayload, done) => {
    if ((token as any).refresh) {
      logger.error({
        message: 'cannot use refresh token as access token',
        extra: { token },
      });
      done(new Error('cannot use refresh token as access token'));
    }
    try {
      done(null, token);
    } catch (err) {
      done(err);
    }
  },
);
