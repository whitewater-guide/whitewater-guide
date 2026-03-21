import type { GraphQLFormattedError } from 'graphql';
import { nanoid } from 'nanoid';

import { logger } from './logger';

export function formatError(
  formattedError: GraphQLFormattedError,
  _error: unknown,
): GraphQLFormattedError {
  // Put unique id into extensions, to grep server logs easier
  const id = nanoid();
  const errorWithId = {
    ...formattedError,
    extensions: { ...formattedError.extensions, id },
  };
  // currently, message is not hidden from client
  // for example, in case of sql error, both formattedError.message and _error.message are
  // "message": "select * from \"abcd\" - relation \"abcd\" does not exist",
  logger.error({ error: { name: 'GraphQLFormattedError', ...errorWithId } });
  return errorWithId;
}
