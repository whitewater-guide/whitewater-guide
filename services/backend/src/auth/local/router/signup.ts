import { sendCredentials } from '../../jwt';
import { MiddlewareFactory } from '../../types';

const signUp: MiddlewareFactory = (passport) => async (ctx, next) => {
  await passport.authenticate(
    'local-signup',
    { badRequestMessage: 'signup.missing.credentials' },
    async (error, user, info) => {
      if (user) {
        sendCredentials(ctx, user);
      } else {
        ctx.throw(401, info);
      }
      await next();
    },
  )(ctx, next);
};

export default signUp;
