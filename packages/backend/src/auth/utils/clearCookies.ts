import Koa from 'koa';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { commonCookieOptions } from './commonCookieOptions';

export const clearCookies = (ctx: Koa.ParameterizedContext<any, any>) => {
  ctx.cookies.set(ACCESS_TOKEN_COOKIE, undefined, commonCookieOptions);
  ctx.cookies.set(REFRESH_TOKEN_COOKIE, undefined, {
    ...commonCookieOptions,
    path: '/auth/jwt/refresh',
  });
};
