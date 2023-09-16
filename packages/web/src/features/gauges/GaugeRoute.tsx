import React, { Suspense } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute } from '../../layout';
import GaugeDetails from './details';
import GaugeForm from './form';

const GaugeRoute: React.FC<RouteComponentProps> = ({ match }) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <AdminRoute exact path={`${match.path}/settings`} component={GaugeForm} />
      <Route component={GaugeDetails} />
    </Switch>
  </Suspense>
);

export default GaugeRoute;
