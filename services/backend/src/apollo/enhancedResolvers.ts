import * as yup from 'yup';

import { AuthenticationError, UserInputError } from 'apollo-server';

import { TopLevelResolver } from '~/apollo';
import { createSafeValidator } from '@whitewater-guide/validation';

export const isAuthenticatedResolver = <Vars>(
  resolver: TopLevelResolver<Vars>,
): TopLevelResolver<Vars> => (source, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError('must authenticate');
  }
  return resolver(source, args, context, info);
};

export const isInputValidResolver = <Vars>(
  schema: yup.Schema<any>,
  resolver: TopLevelResolver<Vars>,
): TopLevelResolver<Vars> => {
  const validator = createSafeValidator(schema);
  return (source, args, context, info) => {
    const validationErrors = validator(args);
    if (validationErrors) {
      throw new UserInputError('invalid input', { validationErrors });
    }
    return resolver(source, args, context, info);
  };
};
