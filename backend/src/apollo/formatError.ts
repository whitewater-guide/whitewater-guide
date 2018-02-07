import { formatError as apolloFormatError } from 'apollo-errors';
import { GraphQLError } from 'graphql';
import { UnknownError } from './enhancedResolvers';

export const formatError = (error: any) => {
  let e = apolloFormatError(error, true);

  if (!e && error instanceof GraphQLError) {
    e = apolloFormatError(new UnknownError({
      data: {
        originalMessage: error.message,
        originalError: error.name,
      },
    }), true);
  }

  return e;
};
