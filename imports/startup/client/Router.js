import React, {Component} from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ListSourcesLeft from '../../ui/pages/sources/ListSourcesLeft';
import NewSource from '../../ui/pages/sources/NewSource';
import ListGauges from '../../ui/pages/sources/ListGauges';
import ListGaugesLeft from '../../ui/pages/sources/ListGaugesLeft';
import SourceSchedule from '../../ui/pages/sources/SourceSchedule';
import NewGauge from '../../ui/pages/gauges/NewGauge';
import EditGauge from '../../ui/pages/gauges/EditGauge';
import EditSource from '../../ui/pages/sources/EditSource';
import ViewSource from '../../ui/pages/sources/ViewSource';
import ViewSourceLeft from '../../ui/pages/sources/ViewSourceLeft';
import ViewGauge from '../../ui/pages/gauges/ViewGauge';
import ViewGaugeLeft from '../../ui/pages/gauges/ViewGaugeLeft';
import ListRegions from '../../ui/pages/regions/ListRegions';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" name="Whitewater" component={MainLayout}>
          <IndexRedirect to="/sources" />
          <Route path="sources" name="Sources" components={{content: ListSources, left: ListSourcesLeft}}/>
          <Route path="sources/new" name="New source" components={{content: NewSource}}/>
          <Route path="sources/:sourceId" name="Src" breadcrumbName=":sourceId" components={{content: ViewSource, left: ViewSourceLeft}}>
            <IndexRedirect to="gauges" />
            <Route path="settings" name="Settings" components={{sourceContent: EditSource}} />
            <Route path="schedule" name="Schedule" components={{sourceContent: SourceSchedule}} />
            <Route path="gauges" name="Gauges" breadcrumbIgnore={true}>
              <IndexRoute name="Gauges" components={{sourceContent: ListGauges, sourceLeft: ListGaugesLeft}} />
              <Route path="new" name="New gauge" components={{sourceContent: NewGauge}} />
            </Route>
          </Route>
          <Route path="gauges/:gaugeId" breadcrumbName=":gaugeId">
            <IndexRoute breadcrumbIgnore={true} components={{ content: ViewGauge, left: ViewGaugeLeft }} />
            <Route path="settings" name="Settings" components={{content: EditGauge, left: ViewGaugeLeft }} />
          </Route>
          <Route path="regions" name="Regions" components={{ content: ListRegions }}/>
        </Route>
      </Router>
    );
  }
}
