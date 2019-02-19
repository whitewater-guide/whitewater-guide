import React from 'react';
import { Switch } from 'react-router-dom';
import { AdminRoute } from '../../layout';
import BannerRoute from './BannerRoute';
import BannerForm from './form';
import BannersList from './list';

export const BannersRoute: React.StatelessComponent = () => (
  <Switch>
    <AdminRoute exact={true} path="/banners" component={BannersList} />
    <AdminRoute exact={true} path="/banners/new" component={BannerForm} />
    <AdminRoute path="/banners/:bannerId" component={BannerRoute} />
  </Switch>
);
