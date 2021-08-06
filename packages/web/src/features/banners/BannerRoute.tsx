import React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';

import { AdminRoute } from '../../layout';
import { BannerForm } from './form';

const BannerRoute: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <AdminRoute exact path={`${match.path}/settings`} component={BannerForm} />
  </Switch>
);

export default BannerRoute;
