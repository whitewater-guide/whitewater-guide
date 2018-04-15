import * as koa from 'koa';

declare module 'koa' {
  interface Request {
    user: any;
  }
}
