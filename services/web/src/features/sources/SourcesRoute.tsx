import React, { Suspense } from 'react';
import { Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { Loading } from '../../components';
import { AdminRoute } from '../../layout';
import SourceForm from './form';
import { SourcesList } from './list';
import SourceRoute from './SourceRoute';

const SourcesRoute: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact={true} path="/sources" component={SourcesList} />
      <AdminRoute exact={true} path="/sources/new" component={SourceForm} />
      <Route path="/sources/:sourceId" component={SourceRoute} />
    </Switch>
  </Suspense>
);

export default SourcesRoute;
