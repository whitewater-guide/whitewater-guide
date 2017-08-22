import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Page403Unauthorized } from './Page403Unauthorized';
import { allRoutes } from './routes';

export const ContentLayout: React.StatelessComponent = () => (
  <Switch>
    <Route path="/">
      <Redirect to="/regions"/>
    </Route>
    {allRoutes.map(({ path, exact, content }) =>
      (<Route key={path} path={path} exact={exact} component={content}/>)
    )}
    <Route path="/403" component={Page403Unauthorized}/>
  </Switch>
);
