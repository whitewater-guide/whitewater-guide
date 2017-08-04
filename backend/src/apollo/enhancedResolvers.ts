import { createError, isInstance } from 'apollo-errors';
import { createResolver } from 'apollo-resolvers';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError as ClassValidationError } from 'class-validator';
import { Role } from '../features/users/types';
import { Context } from './types';

export const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred!  Please try again later',
});

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this',
});

export const ForbiddenError = createError('ForbiddenError', {
  message: 'You are not allowed to do this',
});

export const ValidationError = createError('ValidationError', {
  message: 'Invalid input',
});

export const baseResolver = createResolver<any, Context>(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
  (root, args, context, info, error) => isInstance(error) ? error : new UnknownError(),
);

export const isAuthenticatedResolver = baseResolver.createResolver(
  // Extract the user from context (undefined if non-existent)
  (root, args, { user }) => {
    if (!user) {
      throw new AuthenticationRequiredError();
    }
  },
);

export const isAdminResolver = isAuthenticatedResolver.createResolver(
  // Extract the user and make sure they are an admin
  (root, args, { user }) => {
    // If thrown, this error will bubble up to baseResolver's
    // error callback (if present).  If unhandled, the error is returned to
    // the client within the `errors` array in the response.
    if (user!.role !== Role.ADMIN && user!.role !== Role.SUPERADMIN) {
      throw new ForbiddenError();
    }
    // Since we aren't returning anything from the
    // request resolver, the request will continue on
    // to the next child resolver or the response will
    // return undefined if no child exists.
  },
);

export const isInputValidResolver = (clazz: ClassType<any>) => baseResolver.createResolver(
  async (root, obj) => {
    const withConstructor = { ...obj };
    try {
      await transformAndValidate(
        clazz,
        withConstructor,
        {
          // If required property is missing, graphql will handle this
          validator: { skipMissingProperties: true, validationError: { target: false } },
        },
      );
    } catch (err) {
      const data = err.map((e: ClassValidationError) => ({
        field: e.property,
        error: Object.values(e.constraints).join(' '),
      }));
      throw new ValidationError({ data });
    }
  },
);
