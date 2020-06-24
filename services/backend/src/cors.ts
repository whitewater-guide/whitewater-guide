import cors from '@koa/cors';
import log from '~/log';
import { parse } from 'tldts';

const CORS_WHITELIST = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST!.split(',')
  : [];

export const getCorsMiddleware = (whitelist: string[], appURL: string) => {
  const appDomain = parse(appURL, { validHosts: ['localhost'] }).domain;

  return cors({
    credentials: true,
    maxAge: 60 * 60 * 24, // this is for OPTIONS requests
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    origin: (ctx) => {
      const origin = ctx.get('Origin');
      const originDomain =
        parse(origin, { validHosts: ['localhost'] }).domain || '';
      if (appDomain === originDomain) {
        return origin;
      }
      if (whitelist.includes(originDomain)) {
        return origin;
      } else {
        log.error({ message: 'Invalid CORS origin', extra: { origin } });
        ctx.throw(new Error(`${origin} is not a valid origin`));
      }
      return '';
    },
  });
};

export const corsMiddleware = getCorsMiddleware(
  CORS_WHITELIST,
  process.env.APP_DOMAIN!,
);
