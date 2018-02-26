import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RegionsRoute } from '../features/regions';
import { SourcesRoute } from '../features/sources';
import { TagsRoute } from '../features/tags';
import LogoutRoute from './LogoutRoute';
import UnauthorizedRoute from './UnauthorizedRoute';

const ContentLayout: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/">
      <Redirect from="/" to="/regions"/>
    </Route>

    <Route path="/regions" component={RegionsRoute} />
    <Route path="/sources" component={SourcesRoute} />
    <Route path="/tags" component={TagsRoute} />

    <Route path="/logout">
      <LogoutRoute />
    </Route>

    <Route path="/403">
      <UnauthorizedRoute />
    </Route>
  </Switch>
);

export default ContentLayout;
