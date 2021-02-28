import {
  AccessTokenPayload,
  AuthBody,
  SignInBody,
} from '@whitewater-guide/commons';
import { ParameterizedContext } from 'koa';
import { IRouterParamContext } from 'koa-router';

import config from '~/config';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../constants';
import { getAccessToken, getRefreshToken } from './tokens';

type Ctx = ParameterizedContext<any, IRouterParamContext<any, unknown>>;

export const sendCredentials = (
  ctx: Ctx,
  user: AccessTokenPayload,
  isNew?: boolean,
  rfrshToken?: string,
) => {
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

  if (ctx.query.web || (ctx.request.body && ctx.request.body.web)) {
    ctx.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      signed: false,
    });
    ctx.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
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
