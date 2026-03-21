import cors from '@koa/cors';
import { parse } from 'tldts';

import config from './config';
import log from './log/index';

export const getCorsMiddleware = (whitelist: string[], appURL: string) => {
  const appDomain = parse(appURL, { validHosts: ['localhost'] }).domain;

  return cors({
    credentials: true,
    maxAge: 60 * 60 * 24, // this is for OPTIONS requests
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    origin: (ctx) => {
      const origin = ctx.get('Origin');
      if (!origin) {
        return '';
      }
      const originDomain =
        parse(origin, { validHosts: ['localhost'] }).domain || '';
      if (appDomain === originDomain) {
        return origin;
      }
      if (whitelist.includes(originDomain)) {
        return origin;
      }
      log.error({ message: 'Invalid CORS origin', extra: { origin } });
      ctx.throw(new Error(`${origin} is not a valid origin`));

      return '';
    },
  });
};

export const corsMiddleware = getCorsMiddleware(
  config.CORS_WHITELIST,
  config.API_DOMAIN,
);
