import { AuthPayload } from '@whitewater-guide/commons';
import { Middleware } from 'koa';
import logger from '../logger';

export const errorBodyMiddleware = (
  strategy: string,
): Middleware<any, any> => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { status, message, payload } = err;
    if (status >= 400 && status < 500) {
      ctx.status = status;
      const body: AuthPayload = { success: false, error: message };
      logger.warn({ strategy, ...payload }, message);
      ctx.body = body;
    } else {
      throw err;
    }
  }
};
