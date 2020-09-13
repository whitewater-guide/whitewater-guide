import Koa from 'koa';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';

export const clearCookies = (ctx: Koa.ParameterizedContext<any, any>) => {
  ctx.cookies.set(ACCESS_TOKEN_COOKIE);
  ctx.cookies.set(REFRESH_TOKEN_COOKIE, undefined, {
    httpOnly: true,
    path: '/auth/jwt/refresh',
    signed: false,
  });
};
