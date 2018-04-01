import { Request } from 'koa';
import log from '../log';
import getOrigin from './getOrigin';

export default function getLogoutRedirect(req: Request) {
  const url = req.header('Referer') || '/';
  log.info('Logout redirect', { referer: req.header('Referer'), origin: req.header('Origin') });
  return getOrigin(url) + '/logout';
}
