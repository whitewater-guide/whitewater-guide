import type { ApolloClient } from '@apollo/client';
import type { AuthService } from '@whitewater-guide/clients';
import { WebAuthService } from '@whitewater-guide/clients/dist/web';
import { useEffect, useMemo } from 'react';

import { API_HOST, FACEBOOK_APP_ID } from '../environment';
import { history } from '../history';
import initApolloClient from './initApolloClient';
import useSnackbarError from './useSnackbarError';

interface UseClientHook {
  authService: AuthService;
  apolloClient: ApolloClient<unknown>;
}

export function useClient(): UseClientHook {
  const onApolloError = useSnackbarError();

  const result = useMemo(() => {
    const authService = new WebAuthService(API_HOST, FACEBOOK_APP_ID);
    const apolloClient = initApolloClient(authService, onApolloError);
    return { apolloClient, authService };
  }, [onApolloError]);

  useEffect(() => {
    const onSignIn = () => {
      result.apolloClient.resetStore();
    };

    const onSignOut = async () => {
      history.replace('/regions');
      result.apolloClient.resetStore();
    };

    const removeSignIn = result.authService.on('sign-in', onSignIn);
    const removeSignOut = result.authService.on('sign-out', onSignOut);

    return () => {
      removeSignIn();
      removeSignOut();
    };
  }, [result]);

  return result;
}
