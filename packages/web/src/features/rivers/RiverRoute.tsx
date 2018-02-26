import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import RiverDetails from './details';
import { RiverForm } from './form';

const RiverRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/settings`} component={RiverForm} />
    <Route component={RiverDetails} />
  </Switch>
);

export default RiverRoute;
