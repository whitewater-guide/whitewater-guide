import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import RegionDetails from './details';
import RegionForm from './form';

const RegionRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <Route exact path={`${match.path}/settings`} component={RegionForm} />
    <Route component={RegionDetails} />
  </Switch>
);

export default RegionRoute;
