import { Request } from 'express';
import getOrigin from './getOrigin';

export default function getLogoutRedirect(req: Request) {
  const url = req.header('Referer') || '/';
  return getOrigin(url) + '/logout';
}
