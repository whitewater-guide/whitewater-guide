import React, {Component} from 'react'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ListSourcesLeft from '../../ui/pages/sources/ListSourcesLeft';
import NewSource from '../../ui/pages/sources/NewSource';
import ListGauges from '../../ui/pages/gauges/ListGauges';
import ListGaugesLeft from '../../ui/pages/gauges/ListGaugesLeft';
import SourceSchedule from '../../ui/pages/sources/SourceSchedule';
import TermsOfUse from '../../ui/pages/sources/TermsOfUse';
import NewGauge from '../../ui/pages/gauges/NewGauge';
import EditGauge from '../../ui/pages/gauges/EditGauge';
import EditSource from '../../ui/pages/sources/EditSource';
import ViewSource from '../../ui/pages/sources/ViewSource';
import ViewSourceLeft from '../../ui/pages/sources/ViewSourceLeft';
import ViewGauge from '../../ui/pages/gauges/ViewGauge';
import ViewGaugeLeft from '../../ui/pages/gauges/ViewGaugeLeft';
import ListRegions from '../../ui/pages/regions/ListRegions';
import NewRiver from "../../ui/pages/rivers/NewRiver";
import ListRivers from "../../ui/pages/rivers/ListRivers";
import EditRiver from "../../ui/pages/rivers/EditRiver";
import ViewRiver from "../../ui/pages/rivers/ViewRiver";
import RiverLeft from "../../ui/pages/rivers/RiverLeft";
import ListRiversLeft from "../../ui/pages/rivers/ListRiversLeft";
import NewSection from "../../ui/pages/sections/NewSection";
import ViewSection from "../../ui/pages/sections/ViewSection";
import SectionsLeft from "../../ui/pages/sections/SectionsLeft";
import EditSection from "../../ui/pages/sections/EditSection";
import ListSections from "../../ui/pages/sections/ListSections";
import ManageFiles from "../../ui/pages/files/ManageFiles";
import EditRegion from "../../ui/pages/regions/EditRegion";
import ViewRegion from "../../ui/pages/regions/ViewRegion";
import ViewRegionLeft from "../../ui/pages/regions/ViewRegionLeft";
import RegionMapPage from "../../ui/pages/regions/RegionMapPage";

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" name="Whitewater" component={MainLayout}>
          <IndexRedirect to="/sources" />

          <Route path="files" name="Files" components={{ content: ManageFiles }}/>

          <Route path="sources" name="Sources">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListSources, left: ListSourcesLeft}} />
            <Route path="new" name="New source" components={{content: NewSource}}/>
            <Route path=":sourceId" breadcrumbName=":sourceId">
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewSource, left: ViewSourceLeft}} />
              <Route path="settings" name="Settings" components={{content: EditSource, left: ViewSourceLeft}} />
              <Route path="schedule" name="Schedule" components={{content: SourceSchedule, left: ViewSourceLeft}} />
              <Route path="terms_of_use" name="Terms of use" components={{content: TermsOfUse, left: ViewSourceLeft}} />
            </Route>
          </Route>

          <Route path="gauges" name="Gauges">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListGauges, left: ListGaugesLeft}} />
            <Route path="new" name="New gauge" components={{content: NewGauge}} />
            <Route path=":gaugeId" breadcrumbName=":gaugeId">
              <IndexRoute breadcrumbIgnore={true} components={{ content: ViewGauge, left: ViewGaugeLeft }} />
              <Route path="settings" name="Settings" components={{content: EditGauge, left: ViewGaugeLeft }} />
            </Route>
          </Route>

          <Route path="regions" name="Regions">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListRegions}} />
            <Route path=":regionId" breadcrumbName=":regionId" >
              <IndexRedirect to="/regions/:regionId/map" />
              <Route path="settings" name="Settings" components={{content: EditRegion, left: ViewRegionLeft}}/>
              <Route path="map" name="Map" components={{content: RegionMapPage, left: ViewRegionLeft}}/>
            </Route>
          </Route>

          <Route path="rivers" name="Rivers">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListRivers, left: ListRiversLeft}} />
            <Route path="new" name="Add river" components={{content: NewRiver}}/>
            <Route path=":riverId" breadcrumbName=":riverId" >
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewRiver, left: RiverLeft}} />
              <Route path="settings" name="Settings" components={{content: EditRiver, left: RiverLeft}}/>
            </Route>
          </Route>

          <Route path="sections" name="Sections">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListSections, left: SectionsLeft}} />
            <Route path="new" name="New Section" components={{content: NewSection, left: SectionsLeft}}/>
            <Route path=":sectionId" breadcrumbName=":sectionId" >
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewSection, left: SectionsLeft}} />
              <Route path="settings" breadcrumbName="Settings" components={{content: EditSection, left: SectionsLeft}}/>
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
}
