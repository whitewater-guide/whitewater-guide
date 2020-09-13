import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';

import { RiversRoute } from '../../rivers';
import { SectionsRoute } from '../../sections';
import RegionDetails from './RegionDetails';

export const RegionDetailsRouter: React.FC<RouteComponentProps<any>> = ({
  match,
}) => (
  <Switch>
    <Route
      strict={true}
      path={`${match.path}/rivers/`}
      component={RiversRoute}
    />

    <Route
      strict={true}
      path={`${match.path}/sections/`}
      component={SectionsRoute}
    />

    <Route>
      <RegionDetails />
    </Route>
  </Switch>
);
