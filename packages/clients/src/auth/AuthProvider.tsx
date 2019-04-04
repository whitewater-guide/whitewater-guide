import { DocumentNode } from 'graphql';
import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { MY_PROFILE_QUERY, WithMe } from '../features/users';
import { AuthContext } from './context';
import { AuthService } from './service';
import { AuthType, Credentials } from './types';

interface Props {
  query?: DocumentNode;
  service: AuthService;
}

export const AuthProvider: React.FC<Props> = (props) => {
  const { query = MY_PROFILE_QUERY, service, children } = props;
  const [isTokenRefreshing, setTokenRefreshing] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // try to refresh token when mounted
  useEffect(() => {
    (async function refreshAccessToken() {
      setTokenRefreshing(true);
      await service.refreshAccessToken();
      setTokenRefreshing(false);
    })();
  }, []);

  const signIn = async (type: AuthType, credentials?: Credentials) => {
    if (isTokenRefreshing || isSigningIn || isSigningOut) {
      return;
    }
    setIsSigningIn(true);
    await service.signIn(type, credentials);
    setIsSigningIn(false);
  };

  const signOut = async () => {
    if (isTokenRefreshing || isSigningIn || isSigningOut) {
      return;
    }
    setIsSigningOut(true);
    await service.signOut(false);
    setIsSigningOut(false);
  };

  // if (isTokenRefreshing || isSigningIn) {
  //   return (
  //     <AuthContext.Provider
  //       value={{ me: null, loading: true, signIn, signOut }}
  //     >
  //       {children}
  //     </AuthContext.Provider>
  //   );
  // }

  return (
    <Query<WithMe> query={query} fetchPolicy="cache-and-network">
      {(queryProps) => {
        const me = (queryProps.data && queryProps.data.me) || null;
        const loading =
          queryProps.loading ||
          isTokenRefreshing ||
          isSigningIn ||
          isSigningOut;
        return (
          <AuthContext.Provider value={{ me, loading, signIn, signOut }}>
            {children}
          </AuthContext.Provider>
        );
      }}
    </Query>
  );
};

AuthProvider.displayName = 'AuthProvider';
