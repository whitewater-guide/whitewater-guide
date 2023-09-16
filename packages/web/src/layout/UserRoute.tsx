import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import type { RouteProps } from 'react-router-dom';
import { Redirect, Route } from 'react-router-dom';

export const UserRoute = React.memo((props: RouteProps) => {
  const { me, loading } = useAuth();
  if (!loading && !me) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});

UserRoute.displayName = 'UserRoute';
