import { InMemoryCache } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';

function dataIdFromObject(result: any) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

export const configureApolloCache = () =>
  new InMemoryCache({
    dataIdFromObject,
    addTypename: true,
    cacheRedirects: {
      Query: {
        region: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Region', id })!),
        source: (_, { id }) => toIdValue(dataIdFromObject({ __typename: 'Source', id })!),
      },
    },
  });
