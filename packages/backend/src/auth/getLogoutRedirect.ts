import Koa from 'koa';
import getOrigin from './getOrigin';

export default function getLogoutRedirect(ctx: Koa.Context) {
  const referer = ctx.header.referer;
  const url = referer || '/';
  return getOrigin(url) + '/logout';
}
