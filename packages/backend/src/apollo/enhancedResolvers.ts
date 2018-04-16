import { isInstance } from 'apollo-errors';
import { createResolver } from 'apollo-resolvers';
import Joi, { ValidationOptions } from 'joi';
import { Context } from './context';
import { AuthenticationRequiredError, UnknownError, ValidationError } from './errors';

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

export const isInputValidResolver = (schema: Joi.Schema, options?: ValidationOptions) => baseResolver.createResolver(
  (root: any, value: any) => {
    const { error } = Joi.validate(
      value,
      schema,
      {
        noDefaults: true,
        stripUnknown: { objects: true, arrays: false },
        presence: 'required',
        abortEarly: false,
        convert: false,
        ...options,
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
