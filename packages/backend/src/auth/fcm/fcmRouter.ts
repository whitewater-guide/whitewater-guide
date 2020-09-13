import Router from 'koa-router';

import { fcmMiddleware } from '../utils';

// this is not part of apollo-server because it's needed before apollo client initializes
export const fcmRouter = new Router({ prefix: '/fcm' });

fcmRouter.post(
  '/set',
  async (ctx, next) => {
    ctx.body = { success: true };
    await next();
  },
  fcmMiddleware,
);
