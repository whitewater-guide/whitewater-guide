import ApolloClient from 'apollo-client';
import { createNetworkInterface } from 'apollo-upload-client';

export function configureApolloClient(options: any = {}) {
  return new ApolloClient({
    networkInterface: createNetworkInterface(options),
    ...options,
  });
}
