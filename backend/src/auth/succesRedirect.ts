import { Request, RequestHandler } from 'express';
import * as URL from 'url';
import { isWebUri } from 'valid-url';

function getOrigin(url: string) {
  if (!url || url.startsWith('/')) {
    return '';
  }
  const { protocol, host } = URL.parse(url);
  return `${protocol}//${host}`;
}

function isValidReturnURL(url: string) {
  if (url.startsWith('/')) {
    return true;
  }
  const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST!.split(',') : [];
  return isWebUri(url) && whitelist.includes(getOrigin(url));
}

function getSuccessRedirect(req: Request) {
  const url = req.query.returnTo || req.body.returnTo || '/';
  if (!isValidReturnURL(url)) {
    return '/';
  }
  if (!getOrigin(url)) {
    return url;
  }
  return url;
}

const successRedirect: RequestHandler = (req, res, next) => {
  req.session.returnTo = getSuccessRedirect(req);
  next();
};

export default successRedirect;
