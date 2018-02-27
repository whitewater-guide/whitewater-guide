import { isWebUri } from 'valid-url';
import getOrigin from './getOrigin';

export default function isValidRedirect(url: string) {
  if (url.startsWith('/')) {
    return true;
  }
  const whitelist = process.env.BACK_CORS_WHITELIST ? process.env.BACK_CORS_WHITELIST!.split(',') : [];
  return isWebUri(url) && whitelist.includes(getOrigin(url));
}
