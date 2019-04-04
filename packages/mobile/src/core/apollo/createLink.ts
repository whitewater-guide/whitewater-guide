import { errorLink } from '@whitewater-guide/clients';
import { ApolloLink } from 'apollo-link';
import { MobileAuthService } from '../auth';
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
    errorLink(inMemoryCache, () => auth.signOut(true)),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
