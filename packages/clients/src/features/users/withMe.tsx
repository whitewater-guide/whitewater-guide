import React from 'react';
import { User } from '../../../ww-commons/features/users';
import { MyProfileConsumer } from './MyProfileContext';
import { WithMe } from './types';

export function withMe<Props>(Component: React.ComponentType<Props & WithMe>): React.ComponentType<Props> {

  const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
    <MyProfileConsumer>
      {(me: User | null) => <Component {...props} me={me} />}
    </MyProfileConsumer>
  );
  Wrapper.displayName = 'withMe';

  return Wrapper;
}
