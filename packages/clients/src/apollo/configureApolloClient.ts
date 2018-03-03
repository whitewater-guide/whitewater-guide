import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink, FetchOptions } from 'apollo-link-http';
import { DispatchProp } from 'react-redux';
import { createApolloErrorLink } from './apolloLinkError';
import { configureApolloCache } from './configureApolloCache';

type Options = FetchOptions & DispatchProp<any>;

export function configureApolloClient(options: Options) {
  const { dispatch, ...fetchOptions } = options;

  // Error link enables handy global snackbar with error in webapp
  const errorLink = createApolloErrorLink(dispatch);
  const httpLink = createHttpLink(fetchOptions);

  return new ApolloClient({
    link: ApolloLink.from([ errorLink, httpLink ]),
    cache: configureApolloCache(),
    connectToDevTools: process.env.NODE_ENV === 'development',
  });
}
