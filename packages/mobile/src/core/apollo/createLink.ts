import NetInfo from '@react-native-community/netinfo';
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
      if (error.type === 'fetch') {
        NetInfo.isConnected
          .fetch()
          .then((isConnected) => {
            if (isConnected) {
              trackError('errorLink', error);
            }
          })
          .catch(() => {});
      } else {
        trackError('errorLink', error);
      }
      if (error.type === 'auth') {
        auth.signOut(true);
      }
    }),
    new TokenRefreshLink(auth),
    retryLink,
    httpLink,
  ]);
