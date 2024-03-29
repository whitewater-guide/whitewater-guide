import React, { Suspense } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute } from '../../layout';
import GaugeForm from './form';
import GaugeRoute from './GaugeRoute';

export const GaugesRoute: React.FC<RouteComponentProps<any>> = (props) => {
  const { match } = props;
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <AdminRoute exact path={`${match.path}new`} component={GaugeForm} />
        <Route path={`${match.path}:gaugeId`} component={GaugeRoute} />
      </Switch>
    </Suspense>
  );
};
