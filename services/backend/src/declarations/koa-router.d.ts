import * as koaRouter from 'koa-router';

declare module 'koa-router' {
  interface IRouterContext {
    /**
     * url params
     */
    user: any;
  }
}
