import React, {Component} from 'react'
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';
import MainLayout from '../../ui/layouts/MainLayout';
import ListSources from '../../ui/pages/sources/ListSources';
import ListSourcesLeft from '../../ui/pages/sources/ListSourcesLeft';
import SourceForm from '../../ui/pages/sources/SourceForm';
import ListGaugesLeft from '../../ui/pages/gauges/ListGaugesLeft';
import SourceSchedule from '../../ui/pages/sources/SourceSchedule';
import TermsOfUse from '../../ui/pages/sources/TermsOfUse';
import GaugeForm from '../../ui/pages/gauges/GaugeForm';
import ViewSource from '../../ui/pages/sources/ViewSource';
import ViewSourceLeft from '../../ui/pages/sources/ViewSourceLeft';
import ViewGauge from '../../ui/pages/gauges/ViewGauge';
import ViewGaugeLeft from '../../ui/pages/gauges/ViewGaugeLeft';
import RiverForm from "../../ui/pages/rivers/RiverForm";
import ListRivers from "../../ui/pages/rivers/ListRivers";
import ViewRiver from "../../ui/pages/rivers/ViewRiver";
import RiverLeft from "../../ui/pages/rivers/RiverLeft";
import ListRiversLeft from "../../ui/pages/rivers/ListRiversLeft";
import ViewSection from "../../ui/pages/sections/ViewSection";
import SectionsLeft from "../../ui/pages/sections/SectionsLeft";
import ListSections from "../../ui/pages/sections/ListSections";
import ManageFiles from "../../ui/pages/files/ManageFiles";
import ListUsers from "../../ui/pages/users/ListUsers";
import ListGauges from "../../ui/pages/gauges/ListGauges";
import SectionForm from '../../ui/pages/sections/SectionForm';
import {regionsRoutes} from '../../ui/pages/regions';

export default class AppRouter extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" name="Whitewater" component={MainLayout}>
          <IndexRedirect to="/regions"/>

          <Route path="files" name="Files" components={{content: ManageFiles}}/>
          <Route path="users" name="Users" components={{content: ListUsers}}/>

          <Route path="sources" name="Sources">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListSources, left: ListSourcesLeft}}/>
            <Route path="new" name="New source" components={{content: SourceForm}}/>
            <Route path=":sourceId" breadcrumbName=":sourceId">
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewSource, left: ViewSourceLeft}}/>
              <Route path="settings" name="Settings" components={{content: SourceForm, left: ViewSourceLeft}}/>
              <Route path="schedule" name="Schedule" components={{content: SourceSchedule, left: ViewSourceLeft}}/>
              <Route path="terms_of_use" name="Terms of use" components={{content: TermsOfUse, left: ViewSourceLeft}}/>
            </Route>
          </Route>

          <Route path="gauges" name="Gauges">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListGauges, left: ListGaugesLeft}}/>
            <Route path="new" name="New gauge" components={{content: GaugeForm}}/>
            <Route path=":gaugeId" breadcrumbName=":gaugeId">
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewGauge, left: ViewGaugeLeft}}/>
              <Route path="settings" name="Settings" components={{content: GaugeForm, left: ViewGaugeLeft}}/>
            </Route>
          </Route>

          {regionsRoutes}

          <Route path="rivers" name="Rivers">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListRivers, left: ListRiversLeft}}/>
            <Route path="new" name="Add river" components={{content: RiverForm}}/>
            <Route path=":riverId" breadcrumbName=":riverId">
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewRiver, left: RiverLeft}}/>
              <Route path="settings" name="Settings" components={{content: RiverForm, left: RiverLeft}}/>
            </Route>
          </Route>

          <Route path="sections" name="Sections">
            <IndexRoute breadcrumbIgnore={true} components={{content: ListSections, left: SectionsLeft}}/>
            <Route path="new" name="New Section" components={{content: SectionForm, left: SectionsLeft}}/>
            <Route path=":sectionId" breadcrumbName=":sectionId">
              <IndexRoute breadcrumbIgnore={true} components={{content: ViewSection, left: SectionsLeft}}/>
              <Route path="settings" breadcrumbName="Settings" components={{content: SectionForm, left: SectionsLeft}}/>
            </Route>
          </Route>
        </Route>
      </Router>
    );
  }
}