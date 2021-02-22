import { DocumentNode } from 'graphql';
import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';

import { AuthContext, AuthState } from './context';
import { MY_PROFILE_QUERY } from './myProfile.query';
import { AuthService } from './service';
import { WithMe } from './types';

interface Props {
  query?: DocumentNode;
  service: AuthService;
  renderInitializing?: React.ReactElement;
}

export const AuthProvider: React.FC<Props> = React.memo((props) => {
  const {
    query = MY_PROFILE_QUERY,
    service,
    renderInitializing,
    children,
  } = props;
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    service.on('loading', setLoading);
  }, [service, setLoading]);

  // try to refresh token when mounted
  useEffect(() => {
    const start = async () => {
      try {
        await service.init();
        await service.refreshAccessToken();
      } finally {
        setInitializing(false);
      }
    };

    start();

    return () => {
      service.off('loading');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return renderInitializing || null;
  }

  return (
    <Query<WithMe> query={query} fetchPolicy="cache-and-network">
      {(queryProps) => {
        const { data, refetch } = queryProps;
        const me = (data && data.me) || null;
        const value: AuthState = {
          me,
          loading: queryProps.loading || loading,
          service,
          refreshProfile: refetch,
        };
        return (
          <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
        );
      }}
    </Query>
  );
});

AuthProvider.displayName = 'AuthProvider';
