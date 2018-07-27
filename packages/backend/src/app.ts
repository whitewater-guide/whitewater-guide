import { useAuthMiddleware } from '@auth';
import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlRouter } from './apollo/router';
import getOrigin from './auth/getOrigin';

const app = new Koa();

const CORS_WHITELIST = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST!.split(',') : [];

app.use(cors({
  credentials: true,
  origin: (ctx) => {
    const originIndex = ctx.req.rawHeaders.indexOf('Origin');
    if (originIndex === -1) {
      return true;
    }
    const origin = ctx.req.rawHeaders[originIndex + 1];
    if (!origin) {
      return true;
    }
    if (CORS_WHITELIST.includes(getOrigin(origin))) {
       return origin;
    } else {
       ctx.throw(new Error(`${origin} is not a valid origin`));
    }
    return false;
  },
}));
app.use(bodyParser());
useAuthMiddleware(app);
app.use(graphqlRouter.routes());
app.use(graphqlRouter.allowedMethods());

export default app;
