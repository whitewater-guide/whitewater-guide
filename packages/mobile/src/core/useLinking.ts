import { MY_PROFILE_QUERY } from '@whitewater-guide/clients';
import { useCallback, useEffect, useRef } from 'react';
import { Linking } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import urlParse from 'url-parse';
import Screens from '../screens/screen-names';
import { BACKEND_URL } from '../utils/urls';
import { apolloClient } from './apollo';

const RESET_CALLBACK_URL = `${BACKEND_URL}/auth/local/reset/callback`;

type URLish = string | null | { url: string | null };
type Parsed = ReturnType<typeof urlParse>;

const parseURL = (urlish: URLish) => {
  const url = !!urlish && typeof urlish === 'object' ? urlish.url : urlish;
  if (!url || url.indexOf(RESET_CALLBACK_URL) !== 0) {
    return null;
  }
  return urlParse(url, true);
};

const isReset = ({ href, query }: Parsed) => {
  return (
    href.indexOf(RESET_CALLBACK_URL) === 0 &&
    query &&
    !!query.id &&
    !!query.token
  );
};

const isVerified = ({ href }: Parsed) => {
  return href.indexOf('verified') >= 0;
};

export const useLinking = ({ navigate }: NavigationScreenProp<any>) => {
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const handleURL = useCallback(
    (url: URLish) => {
      const parts = parseURL(url);
      if (parts && isReset(parts)) {
        navigateRef.current(Screens.Auth.Reset, parts.query);
      } else if (parts && isVerified(parts)) {
        apolloClient.query({ query: MY_PROFILE_QUERY }).catch(() => {});
      }
    },
    [navigateRef],
  );
  return useEffect(() => {
    Linking.getInitialURL()
      .then(handleURL)
      .catch(() => {});

    Linking.addEventListener('url', handleURL);
    return () => {
      Linking.removeEventListener('url', handleURL);
    };
  }, [handleURL]);
};
