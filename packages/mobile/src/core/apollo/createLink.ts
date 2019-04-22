import { errorLink } from '@whitewater-guide/clients';
import { ApolloLink } from 'apollo-link';
import { MobileAuthService } from '../auth';
import { trackError } from '../errors';
import { inMemoryCache } from './cache';
import {
  accessTokenLink,
  httpLink,
  retryLink,
  TokenRefreshLink,
} from './links';

export const createLink = (auth: MobileAuthService) =>
  ApolloLink.from([
    accessTokenLink,
    errorLink(inMemoryCache, (error) => {
      trackError('errorLink', error);
      if (error.type === 'auth') {
        auth.signOut(true);
      }
    }),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
