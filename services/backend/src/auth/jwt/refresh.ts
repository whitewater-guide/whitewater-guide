import db from '@db';
import { decode, verify } from 'jsonwebtoken';
import { Middleware } from 'koa';
import { REFRESH_TOKEN_COOKIE } from '../constants';
import cookieJWTExtractor from './cookie-jwt-extractor';
import { sendCredentials } from './sendCredentials';
import { RefreshTokenPayload } from './types';

const extractor = cookieJWTExtractor(REFRESH_TOKEN_COOKIE);

export const refreshJWT: Middleware<any, any> = async (ctx, next) => {
  const token =
    (ctx.request.body && ctx.request.body.refreshToken) ||
    extractor(ctx.request);
  if (!token) {
    ctx.throw(400, 'refresh.jwt.not.found');
    return;
  }

  let payload: RefreshTokenPayload;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as any;
  } catch (err) {
    let id: string | undefined;
    try {
      payload = decode(token) as any;
      id = payload.id;
    } catch {}
    ctx.throw(400, 'refresh.jwt.bad.token', {
      payload: { corrupt: true, id },
    });
    return;
  }

  if (!payload.refresh || !payload.id) {
    ctx.throw(400, 'refresh.jwt.bad.token', {
      payload: { refresh: !!payload.refresh, id: payload.id },
    });
    return;
  }

  const blacklisted = await db()
    .select(db().raw('1'))
    .from('tokens_blacklist')
    .where({ token })
    .first();

  if (!!blacklisted) {
    ctx.throw(400, 'refresh.jwt.bad.token', {
      payload: { blacklisted: true, id: payload.id },
    });
    return;
  }

  await sendCredentials(ctx, { id: payload.id }, token);
  await next();
};
