import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import GaugeDetails from './details';
import { GaugeForm } from './form';

const GaugeRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <AdminRoute exact path={`${match.path}/settings`} component={GaugeForm} />
    <Route component={GaugeDetails} />
  </Switch>
);

export default GaugeRoute;
