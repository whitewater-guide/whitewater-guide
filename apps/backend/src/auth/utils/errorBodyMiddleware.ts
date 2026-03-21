import type { AuthBody } from '@whitewater-guide/commons';
import type { Middleware } from 'koa';
import { nanoid } from 'nanoid';

import logger from '../local/logger';

export const errorBodyMiddleware =
  (strategy: string): Middleware<any, any> =>
  async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      const { status, message, payload } = err;
      if (status >= 400 && status < 500) {
        ctx.status = status;
        const error_id = nanoid();
        const body: AuthBody = { success: false, error: message, error_id };
        logger.warn({
          message,
          tags: { strategy, error_id },
          extra: payload,
        });
        ctx.body = body;
      } else {
        throw err;
      }
    }
  };
