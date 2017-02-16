import React, {Component} from "react";
import {Router, Route, IndexRedirect, browserHistory} from "react-router";
import {MainLayout, Page403Unauthorized} from "./layouts";
import {gaugesRoutes} from "../features/gauges";
import {sourcesRoutes} from "../features/sources";
import {regionsRoutes} from "../features/regions";
import {riversRoutes} from "../features/rivers";
import {sectionsRoutes} from "../features/sections";

export default class AppRouter extends Component {
  //<Route path="files" name="Files" components={{content: ManageFiles}}/>
  //<Route path="users" name="Users" components={{content: ListUsers}}/>
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" name="Whitewater" component={MainLayout}>
          <IndexRedirect to="/regions"/>
          {regionsRoutes}
          {gaugesRoutes}
          {riversRoutes}
          {sectionsRoutes}
          {sourcesRoutes}
          <Route path="/403" name="403" components={{content: Page403Unauthorized}}/>
        </Route>
      </Router>
    );
  }
}