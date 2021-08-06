import React, { Suspense } from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { EditorRoute } from '../../layout';
import RiverForm from './form';

const RiverRoute: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <EditorRoute
        exact
        path={`${match.path}/settings`}
        component={RiverForm}
      />
    </Switch>
  </Suspense>
);

export default RiverRoute;
