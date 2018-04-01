import Koa from 'koa';
import getOrigin from './getOrigin';
import isValidRedirect from './isValidRedirect';

function getLoginRedirect(req: Koa.Request) {
  const url = req.query.returnTo || req.body.returnTo || '/';
  if (!isValidRedirect(url)) {
    return '/';
  }
  if (!getOrigin(url)) {
    return url;
  }
  return url;
}

const setReturnTo: Koa.Middleware = async (ctx, next) => {
  if (ctx.session) {
    ctx.session.returnTo = getLoginRedirect(ctx.request);
  }
  await next();
};

export default setReturnTo;
