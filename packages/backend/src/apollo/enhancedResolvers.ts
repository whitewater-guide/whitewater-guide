import { createError, isInstance } from 'apollo-errors';
import { createResolver } from 'apollo-resolvers';
import { GraphQLFieldResolver } from 'graphql';
import * as Joi from 'joi';
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

export const MutationNotAllowedError = createError('MutationNotAllowedError', {
  message: 'Mutation not allowed',
});

export const baseResolver = createResolver<any, Context>(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
  // (root, args, context, info, error) => isInstance(error) ? error : new UnknownError(),
  (root, args, context, info, error) => isInstance(error) ? error : new UnknownError({ message: error }),
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

export const isSuperadminResolver = isAuthenticatedResolver.createResolver(
  (root, args, { user }) => {
    if (user!.role !== Role.SUPERADMIN) {
      throw new ForbiddenError();
    }
  },
);

export const isInputValidResolver = (schema: Joi.Schema) => baseResolver.createResolver(
  (root, value) => {
    const { error } = Joi.validate(
      value,
      schema,
      {
        noDefaults: true,
        stripUnknown: { objects: true, arrays: false },
        presence: 'required',
        abortEarly: false,
        convert: false,
      },
    );
    if (error) {
      const data = error.details.map(({ message, path }) => ({
        message,
        path: (path as any).join('.'),
      }));
      throw new ValidationError({ data });
    }
  },
);

export const upsertI18nResolver = <TSource, TContext>(resolver: GraphQLFieldResolver<TSource, TContext>) =>
  (source: TSource, args: any, context: TContext, info: any) => {
    const { language = 'en', ...rest } = args;
    return resolver(source, { language, ...rest }, context, info);
  };
