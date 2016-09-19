import React, {Component} from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import NewSource from '../../ui/pages/sources/NewSource';
import ListGauges from '../../ui/pages/gauges/ListGauges';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MainLayout}>
          <IndexRoute component={ListSources} />
          <Route path="/sources" component={ListSources}/>
          <Route path="/gauges" component={ListGauges}/>
        </Route>
      </Router>
    );
  }
}
