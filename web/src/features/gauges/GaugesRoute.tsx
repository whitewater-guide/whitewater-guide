import * as React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import GaugeForm from './form';
import GaugesList from './list';

export const GaugesRoute: React.StatelessComponent = () => (
  <Switch>
    <PrivateRoute exact path="/gauges" component={GaugesList} />
    <PrivateRoute exact path="/sources/:sourceId/gauges/new" component={GaugeForm} />
    <PrivateRoute exact path="/sources/:sourceId/gauges/:gaugeId/settings" component={GaugeForm} />
  </Switch>
);
