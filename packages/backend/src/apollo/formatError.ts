import { formatApolloErrors } from 'apollo-server-errors';
import set from 'lodash/set';
import shortid from 'shortid';

import { logger } from './logger';

export const formatError = (error: any) => {
  const apolloError = formatApolloErrors([error], { debug: true })[0];
  // Put unique id into extensions, to grep server logs easier
  // It should be in extensions and not on the root level: https://facebook.github.io/graphql/June2018/#example-9008d
  const id = shortid.generate();
  set(apolloError, 'extensions.id', id);
  logger.error({ error: apolloError });

  set(apolloError, 'extensions.exception.stacktrace', undefined);
  apolloError.stack = undefined;
  return apolloError;
};
