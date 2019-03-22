import { ParameterizedContext } from 'koa';
import { IRouterParamContext } from 'koa-router';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { SignInResponseBody } from '../types';
import { getAccessToken, getRefreshToken } from './tokens';
import { AccessTokenPayload } from './types';

type Ctx = ParameterizedContext<any, IRouterParamContext<any, {}>>;

export const sendCredentials = (
  ctx: Ctx,
  user: AccessTokenPayload,
  rfrshToken?: string,
) => {
  // there's no session, so do not call ctx.login
  ctx.state.user = user;

  const accessToken = getAccessToken(user.id);
  const refreshToken = rfrshToken || getRefreshToken(user.id);

  const body: SignInResponseBody = {
    success: true,
    id: user.id,
  };

  if (ctx.query.web || (ctx.request.body && ctx.request.body.web)) {
    ctx.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // Make cookie last a bit more than jwt it carries
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES!, 10) * 1000 * 1.2,
      signed: false,
    });
    ctx.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(2038, 0, 1),
      path: '/auth/jwt/refresh',
      signed: false,
    });
  } else {
    body.accessToken = accessToken;
    body.refreshToken = refreshToken;
  }

  ctx.body = body;
};
