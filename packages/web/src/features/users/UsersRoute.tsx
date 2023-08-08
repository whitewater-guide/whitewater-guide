import React from 'react';
import { Route } from 'react-router';

import { UsersMain } from './main';

const UsersRoute: React.FC = () => (
  <Route exact path="/users" component={UsersMain} />
);

export default UsersRoute;
