import Koa from 'koa';

export default function getLogoutRedirect(ctx: Koa.Context) {
  const referer = ctx.header.referer;
  const url = referer || '/';
  return url;
}
