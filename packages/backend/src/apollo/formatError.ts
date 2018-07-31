import { formatError as apolloFormatError } from 'apollo-errors';
import { ApolloError } from 'apollo-server';
import { UnknownError } from './errors';
import { logger } from './logger';

export const formatError = (error: any) => {
  let e = apolloFormatError(error, true);

  if (!e && error instanceof ApolloError) {
    e = apolloFormatError(new UnknownError({
      data: {
        originalMessage: error.message,
        originalError: error.name,
      },
    }), true);
  }

  logger.error(e);

  return e as any;
};
