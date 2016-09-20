import React, {Component} from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ViewSource from '../../ui/pages/sources/ViewSource';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MainLayout}>
          <IndexRoute component={ListSources} />
          <Route path="/sources" component={ListSources}/>
          <Route path="/sources/:id" component={ViewSource}/>
        </Route>
      </Router>
    );
  }
}
