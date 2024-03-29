import type { FC, PropsWithChildren } from 'react';
import React, { memo, useEffect, useState } from 'react';

import type { AuthState } from './context';
import { AuthContext } from './context';
import { useMyProfileQuery } from './myProfile.generated';
import type { AuthService } from './service';

interface Props {
  service: AuthService;
  renderInitializing?: React.ReactElement;
}

export const AuthProvider: FC<PropsWithChildren<Props>> = memo((props) => {
  const { service, renderInitializing, children } = props;
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

  const {
    data,
    refetch,
    loading: queryLoading,
  } = useMyProfileQuery({
    fetchPolicy: 'cache-and-network',
    skip: initializing,
  });

  if (initializing) {
    return renderInitializing || null;
  }

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: AuthState = {
    me: data?.me,
    loading: queryLoading || loading,
    service,
    refreshProfile: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';
