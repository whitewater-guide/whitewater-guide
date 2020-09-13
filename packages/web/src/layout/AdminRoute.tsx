import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const AdminRoute = React.memo((props: RouteProps) => {
  const { me, loading } = useAuth();
  if (!loading && (!me || !me.admin)) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});

AdminRoute.displayName = 'AdminRoute';
