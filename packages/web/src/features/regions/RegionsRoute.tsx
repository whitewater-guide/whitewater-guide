import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute } from '../../layout';
import RegionForm from './form';
import RegionsList from './list';
import RegionRoute from './RegionRoute';

const RegionsRoute: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact={true} path="/regions" component={RegionsList} />
      <AdminRoute exact={true} path="/regions/new" component={RegionForm} />
      <Route path="/regions/:regionId" component={RegionRoute} />
    </Switch>
  </Suspense>
);

export default RegionsRoute;
