import { ApolloLink } from '@apollo/client/link/core';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import type { AuthService } from '@whitewater-guide/clients';
import { errorLink } from '@whitewater-guide/clients';

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
      (_error) => {
        // query errors should be displayed (or not) alongside with data
        // mutations errors should be displayed in a snackbar
      },
    ),
    removeTypenameFromVariables(),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
}
