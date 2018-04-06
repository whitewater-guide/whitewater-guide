import React from 'react';
import { AdminRoute } from '../../layout';
import container from './container';
import GroupsForm from './GroupsForm';

const GroupsWithData = container(GroupsForm);

export const GroupsRoute: React.StatelessComponent = () => (
  <AdminRoute exact path="/groups" component={GroupsWithData} />
);
