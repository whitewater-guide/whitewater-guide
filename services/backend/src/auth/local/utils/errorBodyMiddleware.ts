import { Middleware } from 'koa';
import { SignInResponseBody } from '../../types';
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
      const body: SignInResponseBody = { success: false, error: message };
      logger.warn({ strategy, ...payload }, message);
      ctx.body = body;
    } else {
      throw err;
    }
  }
};
