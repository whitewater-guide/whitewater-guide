import { InMemoryCache } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';
import { dataIdFromObject } from './dataIdFromObject';

export const configureApolloCache = () =>
  new InMemoryCache({
    dataIdFromObject,
    addTypename: true,
    cacheRedirects: {
      Query: {
        region: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Region', id })!),
        source: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Source', id })!),
        gauge: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Gauge', id })!),
        river: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'River', id })!),
        section: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Section', id })!),
      },
    },
  });
