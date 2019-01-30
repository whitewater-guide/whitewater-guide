import React from 'react';
import { MyProfileConsumer } from './MyProfileContext';

export const AdminOnly: React.StatelessComponent = ({ children }) => (
  <MyProfileConsumer>
    {({ me }) => (me && me.admin ? children : null)}
  </MyProfileConsumer>
);
