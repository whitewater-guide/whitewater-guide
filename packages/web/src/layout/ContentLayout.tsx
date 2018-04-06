import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { GroupsRoute } from '../features/groups';
import { RegionsRoute } from '../features/regions';
import { SourcesRoute } from '../features/sources';
import { TagsRoute } from '../features/tags';
import LogoutRoute from './LogoutRoute';
import Page403 from './Page403';
import Page404 from './Page404';

const ContentLayout: React.StatelessComponent = () => (
  <Switch>
    <Route exact path="/">
      <Redirect from="/" to="/regions"/>
    </Route>

    <Route path="/regions" component={RegionsRoute} />
    <Route path="/sources" component={SourcesRoute} />
    <Route path="/tags" component={TagsRoute} />
    <Route path="/groups" component={GroupsRoute} />

    <Route path="/logout">
      <LogoutRoute />
    </Route>

    <Route path="/403">
      <Page403 />
    </Route>

    <Route>
      <Page404 />
    </Route>
  </Switch>
);

export default ContentLayout;
