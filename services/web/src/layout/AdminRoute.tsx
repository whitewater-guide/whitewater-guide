import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const AdminRoute: React.FC<RouteProps> = React.memo((props) => {
  const { me, loading } = useAuth();
  if (!loading && (!me || !me.admin)) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});
