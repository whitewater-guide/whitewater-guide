import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import SectionDetails from './details';
import { SectionForm } from './form';

const SectionRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <PrivateRoute exact path={`${match.path}/settings`} component={SectionForm} />
    <Route component={SectionDetails} />
  </Switch>
);

export default SectionRoute;
