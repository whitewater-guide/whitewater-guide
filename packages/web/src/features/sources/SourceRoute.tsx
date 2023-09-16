import React, { Suspense } from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute } from '../../layout';
import { SourceDetails } from './details';
import SourceForm from './form';

const SourceRoute: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <AdminRoute
        exact
        path={`${match.path}/settings`}
        component={SourceForm}
      />
      <Route component={SourceDetails} />
    </Switch>
  </Suspense>
);

export default SourceRoute;
