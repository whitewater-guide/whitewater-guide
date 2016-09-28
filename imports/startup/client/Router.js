import React, {Component} from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ListSourcesLeft from '../../ui/pages/sources/ListSourcesLeft';
import ViewSource from '../../ui/pages/sources/ViewSource';
import NewSource from '../../ui/pages/sources/NewSource';
import ListGauges from '../../ui/pages/sources/ListGauges';
import ListGaugesLeft from '../../ui/pages/sources/ListGaugesLeft';
import Schedule from '../../ui/pages/sources/Schedule';
import SourceScheduleLeft from '../../ui/pages/sources/SourceScheduleLeft';
import SourceSettings from '../../ui/pages/sources/SourceSettings';
import NewGauge from '../../ui/pages/sources/NewGauge';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MainLayout}>
          <IndexRoute components={{content: ListSources, left: ListSourcesLeft}}/>
          <Route path="sources" components={{content: ListSources, left: ListSourcesLeft}}/>
          <Route path="sources/new" components={{content: NewSource}}/>
          <Route path="sources/:id" component={ViewSource}>
            <IndexRoute components={{content: ListGauges, leftPanel: ListGaugesLeft}} />
            <Route path="schedule" components={{content: Schedule, leftPanel: SourceScheduleLeft}} />
            <Route path="settings" components={{content: SourceSettings}} />
            <Route path="gauges">
              <IndexRoute components={{content: ListGauges, leftPanel: ListGaugesLeft}} />
              <Route path="new" components={{content: NewGauge}} />
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
}
