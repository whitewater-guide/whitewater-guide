import { RefreshTokenPayload } from '@whitewater-guide/commons';
import { decode, verify } from 'jsonwebtoken';
import { Middleware } from 'koa';

import config from '~/config';
import { db } from '~/db';

import { REFRESH_TOKEN_COOKIE } from '../constants';
import { clearCookies } from '../utils';
import cookieJWTExtractor from './cookie-jwt-extractor';
import { sendCredentials } from './sendCredentials';

const extractor = cookieJWTExtractor(REFRESH_TOKEN_COOKIE);

export const refreshJWT: Middleware<any, any> = async (ctx, next) => {
  const token = ctx.request.body?.refreshToken || extractor(ctx.request);
  if (!token) {
    ctx.throw(400, 'refresh.jwt.not_found');
    return;
  }

  let payload: RefreshTokenPayload;
  try {
    payload = verify(token, config.REFRESH_TOKEN_SECRET) as any;
  } catch (err) {
    let id: string | undefined;
    try {
      payload = decode(token) as any;
      id = payload.id;
    } catch {
      /* Ignore */
    }
    clearCookies(ctx);
    ctx.throw(400, 'refresh.jwt.bad_token', {
      payload: { corrupt: true, id },
    });
    return;
  }

  if (!payload.refresh || !payload.id) {
    clearCookies(ctx);
    ctx.throw(400, 'refresh.jwt.bad_token', {
      payload: { refresh: !!payload.refresh, id: payload.id },
    });
    return;
  }

  const blacklisted = await db()
    .select(db().raw('1'))
    .from('tokens_blacklist')
    .where({ token })
    .first();

  if (blacklisted) {
    clearCookies(ctx);
    ctx.throw(400, 'refresh.jwt.bad_token', {
      payload: { blacklisted: true, id: payload.id },
    });
    return;
  }

  sendCredentials(ctx, { id: payload.id }, undefined, token);
  await next();
};
