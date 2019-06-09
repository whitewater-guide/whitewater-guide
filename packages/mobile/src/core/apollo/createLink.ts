import NetInfo from '@react-native-community/netinfo';
import { AuthService, errorLink } from '@whitewater-guide/clients';
import { ApolloLink } from 'apollo-link';
import { trackError } from '../errors';
import { inMemoryCache } from './cache';
import {
  accessTokenLink,
  httpLink,
  retryLink,
  TokenRefreshLink,
} from './links';

export const createLink = (auth: AuthService) =>
  ApolloLink.from([
    accessTokenLink,
    errorLink(inMemoryCache, async (error) => {
      if (error.type === 'fetch') {
        const { isConnected } = await NetInfo.fetch();
        if (isConnected) {
          trackError('errorLink', error);
        }
      } else {
        trackError('errorLink', error);
      }
      if (error.type === 'auth') {
        await auth.signOut(true);
      }
    }),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
