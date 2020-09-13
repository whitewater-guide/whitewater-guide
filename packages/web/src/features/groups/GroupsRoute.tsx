import React from 'react';

import { AdminRoute } from '../../layout';
import GroupsForm from './GroupsForm';

const GroupsRoute: React.FC = () => (
  <AdminRoute exact={true} path="/groups" component={GroupsForm} />
);

export default GroupsRoute;
