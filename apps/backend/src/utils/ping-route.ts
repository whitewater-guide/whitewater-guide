import type Koa from 'koa';
import Router from 'koa-router';

export const addPingRoute = (app: Koa, route = '/ping') => {
  const pingRouter = new Router({ methods: ['HEAD', 'GET', 'OPTIONS'] });

  pingRouter.get(route, (ctx) => {
    ctx.body = 'OK';
  });

  app.use(pingRouter.allowedMethods());
  app.use(pingRouter.routes());
};
