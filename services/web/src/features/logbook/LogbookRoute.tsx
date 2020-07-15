import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Loading } from '../../components';
import DescentDetails from './details';
import DescentForm from './form';
import DescentsList from './list';
import { UserRoute } from '../../layout/UserRoute';

const LogbookRoute: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <UserRoute exact={true} path="/logbook" component={DescentsList} />
      <UserRoute exact={true} path="/logbook/new" component={DescentForm} />
      <UserRoute
        exact={true}
        path="/logbook/:descentId/settings"
        component={DescentForm}
      />
      <UserRoute
        exact={true}
        path="/logbook/:descentId"
        component={DescentDetails}
      />
    </Switch>
  </Suspense>
);

export default LogbookRoute;
