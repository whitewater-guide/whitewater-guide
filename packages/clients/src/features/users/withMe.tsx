import React from 'react';
import { useAuth } from '../../auth';
import { WithMe } from './types';

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
