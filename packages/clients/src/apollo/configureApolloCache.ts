import { InMemoryCache } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';

import { dataIdFromObject } from './dataIdFromObject';
import fragmentMatcher from './fragmentMatcher';

export function configureApolloCache(): InMemoryCache {
  return new InMemoryCache({
    dataIdFromObject,
    addTypename: true,
    fragmentMatcher,
    cacheRedirects: {
      Query: {
        region: (_, { id }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          toIdValue(dataIdFromObject({ __typename: 'Region', id })!),
        source: (_, { id }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          toIdValue(dataIdFromObject({ __typename: 'Source', id })!),
        gauge: (_, { id }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          toIdValue(dataIdFromObject({ __typename: 'Gauge', id })!),
        river: (_, { id }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          toIdValue(dataIdFromObject({ __typename: 'River', id })!),
        section: (_, { id }) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          toIdValue(dataIdFromObject({ __typename: 'Section', id })!),
        sections: (store, { filter: { regionId } }) => {
          // This is brittle. Inspect first argument to see query store keys
          // 'offline_sections' is @connection directive cache
          const offlineStoreKey = `offline_sections({"filter":{"regionId":"${regionId}"}})`;
          // eslint-disable-next-line no-prototype-builtins
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
