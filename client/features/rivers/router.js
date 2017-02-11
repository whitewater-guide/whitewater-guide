import React from "react";
import {Route, IndexRoute} from "react-router";
import ListRivers from "./ListRivers";
import ListRiversLeft from "./ListRiversLeft";
import RiverForm from "./RiverForm";
import ViewRiver from "./ViewRiver";
import RiverLeft from "./RiverLeft";

export const riversRoutes = (
  <Route path="rivers" name="Rivers">
    <IndexRoute breadcrumbIgnore={true} components={{content: ListRivers, left: ListRiversLeft}}/>
    <Route path="new" name="Add river" components={{content: RiverForm}}/>
    <Route path=":riverId" breadcrumbName=":riverId">
      <IndexRoute breadcrumbIgnore={true} components={{content: ViewRiver, left: RiverLeft}}/>
      <Route path="settings" name="Settings" components={{content: RiverForm, left: RiverLeft}}/>
    </Route>
  </Route>
);