import React, {Component} from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ListSourcesLeft from '../../ui/pages/sources/ListSourcesLeft';
import NewSource from '../../ui/pages/sources/NewSource';
import ListGauges from '../../ui/pages/sources/ListGauges';
import ListGaugesLeft from '../../ui/pages/sources/ListGaugesLeft';
import SourceSchedule from '../../ui/pages/sources/SourceSchedule';
import SourceScheduleLeft from '../../ui/pages/sources/SourceScheduleLeft';
import SourceSettings from '../../ui/pages/sources/SourceSettings';
import NewGauge from '../../ui/pages/sources/NewGauge';
import ViewSource from '../../ui/pages/sources/ViewSource';
import ViewSourceLeft from '../../ui/pages/sources/ViewSourceLeft';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" name="Whitewater" component={MainLayout}>
          <IndexRoute name="Whitewater" components={{content: ListSources, left: ListSourcesLeft}}/>
          <Route path="sources" name="Sources" components={{content: ListSources, left: ListSourcesLeft}}/>
          <Route path="sources/new" name="New source" components={{content: NewSource}}/>
          <Route path="sources/:sourceId" name="Src" breadcrumbName=":sourceId" components={{content: ViewSource, left: ViewSourceLeft}}>
            <IndexRoute components={{sourceContent: ListGauges, sourceLeft: ListGaugesLeft}} name="List gauges" />
            <Route path="schedule" name="Schedule" components={{sourceContent: SourceSchedule, sourceLeft: SourceScheduleLeft}} />
            <Route path="settings" name="Settings" components={{content: SourceSettings}} />
            <Route path="gauges" name="Gauges">
              <IndexRoute name="List gauges" components={{content: ListGauges, leftPanel: ListGaugesLeft}} />
              <Route path="new" name="New gauge" components={{content: NewGauge}} />
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
}
