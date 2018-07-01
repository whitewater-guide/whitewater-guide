import { formatError as apolloFormatError } from 'apollo-errors';
import { GraphQLError } from 'graphql';
import log from '../log';
import { UnknownError } from './errors';

const logger = log.child({ module: 'apollo' });

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

  logger.error(e);

  return e as any;
};
