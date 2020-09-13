import React from 'react';

import { WithMe } from './types';
import { useAuth } from './useAuth';

export function withMe<Props>(
  Component: React.ComponentType<Props & WithMe>,
): React.ComponentType<Props> {
  const Wrapper: React.FC<Props> = (props: Props) => {
    const { me } = useAuth();
    return <Component {...props} me={me} />;
  };
  Wrapper.displayName = 'withMe';

  return Wrapper;
}
