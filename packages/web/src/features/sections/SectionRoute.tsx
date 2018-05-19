import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { AdminRoute, EditorRoute } from '../../layout';
import SectionAdmin from './admin';
import SectionDetails from './details';
import { SectionForm } from './form';

const SectionRoute: React.StatelessComponent<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <EditorRoute exact path={`${match.path}/settings`} component={SectionForm} />
    <AdminRoute exact path={`${match.path}/admin`} component={SectionAdmin} />
    <Route component={SectionDetails} />
  </Switch>
);

export default SectionRoute;
