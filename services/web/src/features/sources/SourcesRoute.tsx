import React from 'react';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import SourceForm from './form';
import SourcesList from './list';
import SourceRoute from './SourceRoute';

export const SourcesRoute: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/sources" component={SourcesList} />
    <AdminRoute exact path="/sources/new" component={SourceForm} />
    <Route path="/sources/:sourceId" component={SourceRoute} />
  </Switch>
);
