import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Page403Unauthorized } from './Page403Unauthorized';

export const ContentLayout: React.StatelessComponent = () => (
  <Switch>
    <Route path="/">
      <Redirect to="/regions"/>
    </Route>
    <Route path="/403" component={Page403Unauthorized}/>
  </Switch>
);
