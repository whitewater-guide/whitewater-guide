import React from 'react';

import { useAuth } from './useAuth';

export const AdminOnly: React.FC = ({ children }) => {
  const { me } = useAuth();
  return me && me.admin ? (children as any) : null;
};
