import { DocumentNode } from 'graphql';
import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { MY_PROFILE_QUERY, WithMe } from '../features/users';
import { AuthContext } from './context';
import { AuthService } from './service';

interface Props {
  query?: DocumentNode;
  service: AuthService;
}

export const AuthProvider: React.FC<Props> = React.memo((props) => {
  const { query = MY_PROFILE_QUERY, service, children } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    service.listener = setLoading;
  }, [setLoading]);

  // try to refresh token when mounted
  useEffect(() => {
    service.refreshAccessToken();
    return () => {
      service.listener = null;
    };
  }, []);

  return (
    <Query<WithMe> query={query} fetchPolicy="cache-and-network">
      {(queryProps) => {
        const { data, refetch } = queryProps;
        const me = (data && data.me) || null;
        return (
          <AuthContext.Provider
            value={{
              me,
              loading: queryProps.loading || loading,
              service,
              refreshProfile: refetch,
            }}
          >
            {children}
          </AuthContext.Provider>
        );
      }}
    </Query>
  );
});

AuthProvider.displayName = 'AuthProvider';
