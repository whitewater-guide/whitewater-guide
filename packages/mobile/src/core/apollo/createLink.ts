import { ApolloLink } from '@apollo/client/link/core';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import type { AuthService } from '@whitewater-guide/clients';
import { errorLink } from '@whitewater-guide/clients';

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
        // do not hit sentry every time when user is offline
        if (error.networkError?.message !== 'Network request failed') {
          trackError('errorLink', error);
        }
        // query errors should be displayed (or not) alongside with data
        // mutations errors should be displayed in a snackbar
        // here we just track errors
      },
    ),
    removeTypenameFromVariables(),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
}
