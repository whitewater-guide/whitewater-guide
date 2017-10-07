import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import RegionForm from './form';
import RegionsList from './list';
import SourceForm from '../../../../web-client/src/features/sources/SourceForm';

const Regions: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/sources" component={SourcesList} />
    <PrivateRoute exact path="/sources/new" component={SourceForm} />
    <PrivateRoute exact path="/sources/:sourceId/settings" component={SourceForm} />
  </Switch>
);

export default Regions;
