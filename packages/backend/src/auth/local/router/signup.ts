import { sendCredentials } from '../../jwt/index';
import type { MiddlewareFactory } from '../../types';

const signUp: MiddlewareFactory = (passport) => async (ctx, next) => {
  await passport.authenticate(
    'local-signup',
    { badRequestMessage: 'signup.errors.email.missing' },
    async (error, user, info) => {
      if (user) {
        sendCredentials(ctx, user, true);
      } else {
        ctx.throw(401, info);
      }
      await next();
    },
  )(ctx, next);
};

export default signUp;
