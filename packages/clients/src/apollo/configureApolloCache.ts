import { InMemoryCache } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';

function dataIdFromObject(result: any) {
  if (result.__typename) {
    if (result.id !== undefined) {
      const lang = result.language ? `:${result.language}` : '';
      return `${result.__typename}:${result.id}${lang}`;
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
        region: (_, { id, language = 'en' }) => toIdValue(dataIdFromObject({ __typename: 'Region', id,  language })!),
        source: (_, { id, language = 'en' }) => toIdValue(dataIdFromObject({ __typename: 'Source', id,  language })!),
      },
    },
  });
