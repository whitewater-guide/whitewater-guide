import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import SourceDetails from './details';
import SourceForm from './form';

const SourceRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <AdminRoute exact path={`${match.path}/settings`} component={SourceForm} />
    <Route component={SourceDetails} />
  </Switch>
);

export default SourceRoute;
