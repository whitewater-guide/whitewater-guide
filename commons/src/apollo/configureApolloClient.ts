import ApolloClient from 'apollo-client';
import { createNetworkInterface } from 'apollo-upload-client';

export default function configureApolloClient(options = {}) {
  return new ApolloClient({
    networkInterface: createNetworkInterface(options),
    ...options
  });
}
