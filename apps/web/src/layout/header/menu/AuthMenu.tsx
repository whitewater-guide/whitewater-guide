import { CircularProgress } from '@material-ui/core';
import { useAuth } from '@whitewater-guide/clients';
import React from 'react';

import AnonMenu from './AnonMenu';
import UserMenu from './UserMenu';

export const AuthMenu: React.FC = React.memo(() => {
  const { me, loading } = useAuth();
  if (loading) {
    return <CircularProgress color="inherit" />;
  }
  if (me) {
    return <UserMenu />;
  }
  return <AnonMenu />;
});

AuthMenu.displayName = 'AuthMenu';
