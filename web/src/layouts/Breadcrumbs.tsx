import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { allRoutes } from './routes';

export const Breadcrumbs: React.StatelessComponent = () => (
  <Switch>
    <Route path="/" exact>
      <Redirect to="/regions"/>
    </Route>
    {allRoutes.map(({ path, exact, top }) =>
      (<Route key={path} path={path} exact={exact} component={top} />),
    )}
  </Switch>
);
