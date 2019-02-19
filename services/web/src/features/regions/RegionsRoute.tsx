import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import RegionForm from './form';
import RegionsList from './list';
import RegionRoute from './RegionRoute';

export const RegionsRoute: React.StatelessComponent = () => (
  <Switch>
    <Route exact={true} path="/regions" component={RegionsList} />
    <AdminRoute exact={true} path="/regions/new" component={RegionForm} />
    <Route path="/regions/:regionId" component={RegionRoute} />
  </Switch>
);
