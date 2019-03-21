import Koa from 'koa';

const getLoginRedirect = (req: Koa.Request) =>
  req.query.returnTo || (req.body! as any).returnTo || '/';

export const setReturnTo: Koa.Middleware = async (ctx, next) => {
  if (ctx.session) {
    ctx.session.returnTo = getLoginRedirect(ctx.request);
  }
  await next();
};
