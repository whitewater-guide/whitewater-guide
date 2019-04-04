import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const AdminRoute: React.FC<RouteProps> = ({ component, ...props }) => {
  const { me } = useAuth();
  if (!me || !me.admin) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} component={component} />;
};
