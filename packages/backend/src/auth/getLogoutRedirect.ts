import { Request } from 'express';
import getOrigin from './getOrigin';
import log from '../log';

export default function getLogoutRedirect(req: Request) {
  const url = req.header('Referer') || '/';
  log.info('Logout redirect', { referer: req.header('Referer'), origin: req.header('Origin') });
  return getOrigin(url) + '/logout';
}
