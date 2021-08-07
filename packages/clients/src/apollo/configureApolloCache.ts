import { InMemoryCache } from 'apollo-cache-inmemory';

import { dataIdFromObject } from './dataIdFromObject';
import fragmentMatcher from './fragmentMatcher';

export function configureApolloCache(): InMemoryCache {
  return new InMemoryCache({
    dataIdFromObject,
    addTypename: true,
    fragmentMatcher,
    cacheRedirects: {
      Query: {
        section: (_store, { id }, { getCacheKey }) =>
          getCacheKey({ __typename: 'Section', id }),
        sections: (store, { filter: { regionId } }) => {
          // This is brittle. Inspect first argument to see query store keys
          // 'offline_sections' is @connection directive cache
          const offlineStoreKey = `offline_sections({"filter":{"regionId":"${regionId}"}})`;
          if (store.hasOwnProperty(offlineStoreKey)) {
            return {
              generated: false,
              id: `$ROOT_QUERY.${offlineStoreKey}`,
              type: 'id',
              typename: 'SectionsList',
            };
          }
          return undefined;
        },
      },
    },
  });
}
