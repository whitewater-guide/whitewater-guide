import ApolloClient, { FragmentMatcherInterface } from 'apollo-client';
import { ApolloStateSelector } from 'apollo-client/ApolloClient';
import { IdGetter } from 'apollo-client/core/types';
import { CustomResolverMap } from 'apollo-client/data/readFromStore';
import { NetworkInterfaceOptions } from 'apollo-client/transport/networkInterface';
import { createNetworkInterface } from 'apollo-upload-client';

// ApolloClient constructor options are not exported, copy-paste :(
interface ConstructorOptions {
  reduxRootSelector?: ApolloStateSelector;
  initialState?: any;
  dataIdFromObject?: IdGetter;
  ssrMode?: boolean;
  ssrForceFetchDelay?: number;
  addTypename?: boolean;
  customResolvers?: CustomResolverMap;
  connectToDevTools?: boolean;
  queryDeduplication?: boolean;
  fragmentMatcher?: FragmentMatcherInterface;
}

type Options = ConstructorOptions & NetworkInterfaceOptions;

export function configureApolloClient(options: Options) {
  return new ApolloClient({
    networkInterface: createNetworkInterface(options),
    ...options as any,
  });
}
