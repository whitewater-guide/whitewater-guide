import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { EditorRoute } from '../../layout';
import RiverDetails from './details';
import { RiverForm } from './form';

const RiverRoute: React.StatelessComponent<RouteComponentProps<any>> = ({
  match,
}) => (
  <Switch>
    <EditorRoute exact path={`${match.path}/settings`} component={RiverForm} />
    <Route component={RiverDetails} />
  </Switch>
);

export default RiverRoute;