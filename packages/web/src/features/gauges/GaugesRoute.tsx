import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import { GaugeForm } from './form';
import GaugeRoute from './GaugeRoute';
import { GaugesList } from './list';

export const GaugesRoute: React.StatelessComponent<RouteComponentProps<any>> = (props) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return (
    path.includes('/sources/') ?
      (
        <Switch>
          <AdminRoute exact path={`${path}new`} component={GaugeForm} />
          <Route path={`${path}:gaugeId`} component={GaugeRoute} />
        </Switch>
      ) :
      (
        <Route exact path={`${path}`} component={GaugesList} />
      )
  );
};
