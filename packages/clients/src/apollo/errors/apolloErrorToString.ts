import { ApolloError } from 'apollo-client';
import get from 'lodash/get';

export const apolloErrorToString = (e?: ApolloError): string => {
  if (!e) {
    return '';
  }
  const { networkError, graphQLErrors } = e;
  if (graphQLErrors && graphQLErrors.length) {
    const message = graphQLErrors[0].message;
    const id = get(graphQLErrors, '0.extensions.id');
    let result = 'GraphQL error ';
    if (id) {
      result = `${result} (${id})`;
    }
    return `${result}: ${message}`;
  }
  if (networkError) {
    return `Network error: ${networkError.message}`;
  }
  return 'Something bad happened';
};
