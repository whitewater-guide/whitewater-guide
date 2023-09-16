import cookie from 'cookie';
import type { JwtFromRequestFunction } from 'passport-jwt';

import { identity } from '../../utils/index';

type CookieJwtExtractor = (cookieName: string) => JwtFromRequestFunction;

const cookieJWTExtractor: CookieJwtExtractor = (cookieName) => (req) => {
  let cookies: string | undefined;
  try {
    cookies = req.get('cookie');
  } catch {
    /* Ignore */
  }
  if (!cookies) {
    return '';
  }
  const parsed = cookie.parse(cookies, { decode: identity });
  if (parsed[cookieName]) {
    return parsed[cookieName];
  }
  return '';
};

export default cookieJWTExtractor;
