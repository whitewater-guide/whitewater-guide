declare module '@koa/cors' {
  import * as Koa from 'koa';

  namespace cors {
    interface Options {
      origin?: string | ((ctx: Koa.Context) => boolean | string);
      exposeHeaders?: string[];
      maxAge?: number;
      credentials?: boolean;
      allowMethods?: string[];
      allowHeaders?: string[];
    }
  }

  function cors(options?: cors.Options): Koa.Middleware;

  export = cors;
}
