import Koa from 'koa';

type Ctx = Pick<Koa.Context, 'header'>;

export default function getLogoutRedirect(ctx: Ctx) {
  const referer = ctx.header.referer;
  const url = referer || '/';
  return url;
}
