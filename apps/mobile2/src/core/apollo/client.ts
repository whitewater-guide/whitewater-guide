import { ApolloClient } from '@apollo/client';
import type { AuthService } from '@whitewater-guide/clients';

import { assertCachePersistorVersion, cache } from './cache';
import { createLink } from './createLink';

export async function initApolloClient(
  auth: AuthService,
): Promise<ApolloClient<unknown>> {
  await assertCachePersistorVersion();

  return new ApolloClient({
    link: createLink(auth),
    cache,
    connectToDevTools: __DEV__,
    defaultOptions: {
      mutate: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      watchQuery: {
        errorPolicy: 'all',
      },
    },
  });
}
