import React from 'react';
import { MyProfileConsumer } from './MyProfileContext';
import { WithMe } from './types';

export function withMe<Props>(Component: React.ComponentType<Props & WithMe>): React.ComponentType<Props> {

  const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
    <MyProfileConsumer>
      {({ me, loading }) => <Component {...props} me={me} meLoading={loading} />}
    </MyProfileConsumer>
  );
  Wrapper.displayName = 'withMe';

  return Wrapper;
}
