import * as React from 'react';
import { Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import SourceForm from './form';
import SourcesList from './list';
import SourceRoute from './SourceRoute';

export const SourcesRoute: React.StatelessComponent = () => (
  <Switch>
    <PrivateRoute exact path="/sources" component={SourcesList} />
    <PrivateRoute exact path="/sources/new" component={SourceForm} />
    <PrivateRoute path="/sources/:sourceId" component={SourceRoute} />
  </Switch>
);
