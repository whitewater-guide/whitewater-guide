import { createSafeValidator } from '@whitewater-guide/validation';
import { AuthenticationError, UserInputError } from 'apollo-server-koa';
import * as yup from 'yup';

import { AuthenticatedTopLevelResolver, TopLevelResolver } from './types';

export const isAuthenticatedResolver = <Vars>(
  resolver: AuthenticatedTopLevelResolver<Vars>,
): TopLevelResolver<Vars> => (source, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError('must authenticate');
  }
  return resolver(source, args, context as any, info);
};

export const isInputValidResolver = <Vars>(
  schema: yup.SchemaOf<any>,
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
