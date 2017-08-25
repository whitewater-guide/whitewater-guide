import { Request, RequestHandler } from 'express';
import getOrigin from './getOrigin';
import isValidRedirect from './isValidRedirect';

function getLoginRedirect(req: Request) {
  const url = req.query.returnTo || req.body.returnTo || '/';
  if (!isValidRedirect(url)) {
    return '/';
  }
  if (!getOrigin(url)) {
    return url;
  }
  return url;
}

const setReturnTo: RequestHandler = (req, res, next) => {
  req.session.returnTo = getLoginRedirect(req);
  next();
};

export default setReturnTo;
