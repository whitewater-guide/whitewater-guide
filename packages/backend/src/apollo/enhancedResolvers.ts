import { createValidator } from '@ww-commons/utils/validation';
import { isInstance } from 'apollo-errors';
import { createResolver } from 'apollo-resolvers';
import { Kind } from 'superstruct';
import { AuthenticationRequiredError, UnknownError, ValidationError } from './errors';

export const baseResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,
  // Only mask outgoing errors that aren't already apollo-errors, such as ORM errors etc
  (root, args, context, error) => isInstance(error) ? error : new UnknownError({ message: error }),
);

export const isAuthenticatedResolver = baseResolver.createResolver(
  // Extract the user from context (undefined if non-existent)
  (root, args, { user }) => {
    if (!user) {
      throw new AuthenticationRequiredError();
    }
  },
);

export const isInputValidResolver = (struct: Kind) => {
  const validator = createValidator(struct);
  return baseResolver.createResolver(
    (_, value) => {
      const errors = validator(value);
      if (errors) {
        throw new ValidationError({ data: errors });
      }
    },
  );
};
