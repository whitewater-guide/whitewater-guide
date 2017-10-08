import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import RegionForm from './form';
import RegionsList from './list';

export const RegionsRoute: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/regions" component={RegionsList} />
    <PrivateRoute exact path="/regions/new" component={RegionForm} />
    <PrivateRoute exact path="/regions/:regionId/settings" component={RegionForm} />
  </Switch>
);
