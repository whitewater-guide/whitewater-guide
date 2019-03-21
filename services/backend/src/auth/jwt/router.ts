import Router from 'koa-router';
import { errorBodyMiddleware } from '../local/utils';
import { refreshJWT } from './refresh';

export const initJwtRouter = () => {
  const router = new Router({
    prefix: '/auth/jwt',
  });
  router.use(errorBodyMiddleware('jwt'));
  router.post('/refresh', refreshJWT);
  return router;
};
