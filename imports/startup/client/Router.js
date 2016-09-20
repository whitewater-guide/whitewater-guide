import React, {Component} from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ViewSource from '../../ui/pages/sources/ViewSource';
import ListGauges from '../../ui/pages/sources/ListGauges';
import Schedule from '../../ui/pages/sources/Schedule';
import SourceSettings from '../../ui/pages/sources/SourceSettings';
import NewGauge from '../../ui/pages/sources/NewGauge';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MainLayout}>
          <IndexRoute component={ListSources} />
          <Route path="sources" component={ListSources}/>
          <Route path="sources/:id" component={ViewSource}>
            <IndexRoute component={ListGauges} />
            <Route path="schedule" component={Schedule}/>
            <Route path="settings" component={SourceSettings}/>
            <Route path="gauges">
              <IndexRoute component={ListGauges}/>
              <Route path="new" component={NewGauge}/>
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
}
