import { ApolloLink } from '@apollo/client/link/core';
import { AuthService, errorLink } from '@whitewater-guide/clients';

import { trackError } from '../errors';
import {
  accessTokenLink,
  httpLink,
  retryLink,
  TokenRefreshLink,
} from './links';

export function createLink(auth: AuthService): ApolloLink {
  return ApolloLink.from([
    accessTokenLink,
    errorLink(
      () => {
        auth.signOut(true);
      },
      (error) => {
        trackError('errorLink', error);
        // query errors should be displayed (or not) alongside with data
        // mutations errors should be displayed in a snackbar
        // here we just track errors
      },
    ),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
}
