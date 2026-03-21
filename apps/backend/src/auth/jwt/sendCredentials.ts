import type {
  AccessTokenPayload,
  AuthBody,
  SignInBody,
} from '@whitewater-guide/commons';
import type { ParameterizedContext } from 'koa';
import type { IRouterParamContext } from 'koa-router';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { commonCookieOptions } from '../utils/index';
import { getAccessToken, getRefreshToken } from './tokens';

type Ctx = ParameterizedContext<any, IRouterParamContext<any, unknown>>;

export const sendCredentials = (
  ctx: Ctx,
  user: AccessTokenPayload,
  isNew?: boolean,
  rfrshToken?: string,
): void => {
  // there's no session, so do not call ctx.login
  ctx.state.user = user;

  const accessToken = getAccessToken(user.id);
  const refreshToken = rfrshToken || getRefreshToken(user.id);

  const body: AuthBody<SignInBody> = {
    success: true,
    id: user.id,
  };
  if (isNew !== undefined) {
    body.isNew = isNew;
  }

  if (ctx.query.web || (ctx.request.body as Record<string, unknown>)?.web) {
    ctx.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...commonCookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
    ctx.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...commonCookieOptions,
      expires: new Date(2038, 0, 1),
      path: '/auth/jwt/refresh',
    });
  } else {
    body.accessToken = accessToken;
    body.refreshToken = refreshToken;
  }

  ctx.body = body;
};
