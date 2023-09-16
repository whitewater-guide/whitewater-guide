import type { ApolloError } from '@apollo/client';
import get from 'lodash/get';

export function apolloErrorToString(e?: ApolloError): string {
  if (!e) {
    return '';
  }
  const { networkError, graphQLErrors } = e;
  if (graphQLErrors?.length) {
    const { message } = graphQLErrors[0];
    const id = get(graphQLErrors, '0.extensions.id');
    let result = 'GraphQL error ';
    if (id) {
      result = `${result} (${id})`;
    }
    return `${result}: ${message}`;
  }
  if (networkError) {
    const id = get(networkError, 'result.error_d');
    let result = 'Network error';
    if (id) {
      result = `${result} (${id})`;
    }
    return `${result}: ${networkError.message}`;
  }
  return 'Something bad happened';
}
