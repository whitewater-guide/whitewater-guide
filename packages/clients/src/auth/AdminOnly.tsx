import type { FC, PropsWithChildren } from 'react';

import { useAuth } from './useAuth';

export const AdminOnly: FC<PropsWithChildren> = ({ children }) => {
  const { me } = useAuth();
  return me?.admin ? (children as any) : null;
};
