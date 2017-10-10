import * as React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import SourceForm from './form';
import SourcesList from './list';

export const SourcesRoute: React.StatelessComponent = () => (
  <Switch>
    <PrivateRoute exact path="/sources" component={SourcesList} />
    <PrivateRoute exact path="/sources/new" component={SourceForm} />
    <PrivateRoute exact path="/sources/:sourceId/settings" component={SourceForm} />
  </Switch>
);
