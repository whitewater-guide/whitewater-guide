import { AuthPayload } from '@whitewater-guide/commons';
import { Middleware } from 'koa';
import shortid from 'shortid';
import logger from '../local/logger';

export const errorBodyMiddleware = (
  strategy: string,
): Middleware<any, any> => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { status, message, payload } = err;
    if (status >= 400 && status < 500) {
      ctx.status = status;
      const errorId = shortid.generate();
      const body: AuthPayload = { success: false, error: message, errorId };
      logger.warn({ strategy, ...payload, errorId }, message);
      ctx.body = body;
    } else {
      throw err;
    }
  }
};
