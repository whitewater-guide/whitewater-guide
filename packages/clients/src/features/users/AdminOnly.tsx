import React from 'react';
import { User } from '../../../ww-commons/features/users';
import { MyProfileConsumer } from './MyProfileContext';

export const AdminOnly: React.StatelessComponent = ({ children }) => (
  <MyProfileConsumer>
    {(me: User | null) => (me && me.admin) ? children : null}
  </MyProfileConsumer>
);
