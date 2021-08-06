import Koa from 'koa';

type Ctx = Pick<Koa.Context, 'header'>;

export const getLogoutRedirect = (ctx: Ctx) => {
  const { referer } = ctx.header;
  const url = referer || '/';
  return url;
};
