import React from 'react';
import type { RouteComponentProps } from 'react-router-dom';
import { Switch } from 'react-router-dom';

import { AdminRoute } from '../../layout';
import { BannerForm } from './form';

const BannerRoute: React.FC<RouteComponentProps<any>> = ({ match }) => (
  <Switch>
    <AdminRoute exact path={`${match.path}/settings`} component={BannerForm} />
  </Switch>
);

export default BannerRoute;
