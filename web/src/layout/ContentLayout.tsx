import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Logout from './Logout';
import { Page403Unauthorized } from './Page403Unauthorized';

export const ContentLayout: React.StatelessComponent = () => (
  <Switch>
    <Route path="/">
      <Redirect to="/regions"/>
    </Route>
    <Route path="/logout" component={Logout} />
    <Route path="/403" component={Page403Unauthorized}/>
  </Switch>
);
