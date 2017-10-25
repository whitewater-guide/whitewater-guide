import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { GaugeForm } from '../gauges';
import SourceDetails from './details';
import SourceForm from './form';

const SourceRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}/settings`} component={SourceForm} />
    <Route exact path={`${match.url}/gauges/new`} component={GaugeForm} />
    <Route strict path={`${match.url}/gauges/`} component={GaugeForm} />
    <Route component={SourceDetails} />
  </Switch>
);

export default SourceRoute;
