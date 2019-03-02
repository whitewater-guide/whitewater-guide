import cors from '@koa/cors';
import log from '@log';
import { parse } from 'tldts';

const CORS_WHITELIST = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST!.split(',')
  : [];

export const getCorsMiddleware = (whitelist: string[], appURL: string) => {
  const appDomain = parse(appURL, { validHosts: ['localhost'] }).domain;

  return cors({
    credentials: true,
    maxAge: 60 * 60 * 24, // this is for OPTIONS requests
    origin: (ctx) => {
      const originIndex = ctx.req.rawHeaders.indexOf('Origin');
      if (originIndex === -1) {
        return true;
      }
      const origin = ctx.req.rawHeaders[originIndex + 1];
      if (!origin) {
        return true;
      }
      const originDomain =
        parse(origin, { validHosts: ['localhost'] }).domain || '';
      if (appDomain === originDomain) {
        return origin;
      }
      if (whitelist.includes(originDomain)) {
        return origin;
      } else {
        log.error({ origin }, 'Invalid CORS origin');
        ctx.throw(new Error(`${origin} is not a valid origin`));
      }
      return false;
    },
  });
};

export const corsMiddleware = getCorsMiddleware(
  CORS_WHITELIST,
  process.env.APP_DOMAIN!,
);
