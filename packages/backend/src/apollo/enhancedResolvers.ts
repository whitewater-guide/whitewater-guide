import { TopLevelResolver } from '@apollo';
import { createValidator } from '@ww-commons/utils/validation';
import { AuthenticationError, UserInputError } from 'apollo-server';
import { Kind } from 'superstruct';

export const isAuthenticatedResolver = <Vars>(resolver: TopLevelResolver<Vars>): TopLevelResolver<Vars> =>
  (source, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('must authenticate');
    }
    return resolver(source, args, context, info);
  };

export const isInputValidResolver = <Vars>(struct: Kind, resolver: TopLevelResolver<Vars>): TopLevelResolver<Vars> => {
  const validator = createValidator(struct);
  return (source, args, context, info) => {
    const errors = validator(args);
    if (errors) {
      throw new UserInputError('invalid input', { validationErrors: errors });
    }
    return resolver(source, args, context, info);
  };
};
