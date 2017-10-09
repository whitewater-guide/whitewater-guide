// tslint:disable:no-submodule-imports
import ApolloClient, { FragmentMatcherInterface, toIdValue } from 'apollo-client';
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

function dataIdFromObject(result: any) {
  if (result.__typename) {
    if (result.id !== undefined) {
      const lang = result.language ? `:${result.language}` : '';
      return `${result.__typename}:${result.id}${lang}`;
    }
  }
  return null;
}

export function configureApolloClient(options: Options) {
  return new ApolloClient({
    networkInterface: createNetworkInterface(options),
    customResolvers: {
      Query: {
        region: (_, { id, language = 'en' }) => toIdValue(dataIdFromObject({ __typename: 'Region', id,  language })!),
      },
    },
    dataIdFromObject,
    ...options as any,
  });
}
