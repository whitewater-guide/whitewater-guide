import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import ListRegions from "./ListRegions";
import ViewRegionLeft from "./ViewRegionLeft";
import RegionMapPage from "./RegionMapPage";
import RegionForm from "./RegionForm";

export const regionsRoutes = (
  <Route path="regions" name="Regions">
    <IndexRoute breadcrumbIgnore={true} components={{content: ListRegions}}/>
    <Route path=":regionId" breadcrumbName=":regionId">
      <IndexRedirect to="/regions/:regionId/map"/>
      <Route path="settings" name="Settings" components={{content: RegionForm, left: ViewRegionLeft}}/>
      <Route path="map" name="Map" components={{content: RegionMapPage, left: ViewRegionLeft}}/>
    </Route>
  </Route>
);