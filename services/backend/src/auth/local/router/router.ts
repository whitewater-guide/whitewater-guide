import Router from 'koa-router';
import { KoaPassport } from '../../types';
import { errorBodyMiddleware } from '../../utils';
import reset from './reset';
import resetRequest from './resetRequest';
import signIn from './signin';
import signUp from './signup';
import verification from './verification';
import verificationRequest from './verificationRequest';

export const initLocalRouter = (passport: KoaPassport) => {
  const router = new Router({
    prefix: '/auth/local',
  });

  router.use(errorBodyMiddleware('local'));
  router.post('/signin', signIn(passport));
  router.post('/signup', signUp(passport));
  router.post('/reset/request', resetRequest);
  router.post('/reset', reset);
  router.post('/verification/request', verificationRequest);
  // Links from emails are GET
  router.get('/verification', verification);

  return router;
};
