import React from "react";
import {Route, IndexRoute} from "react-router";
import ListGauges from "./ListGauges";
import ListGaugesLeft from "./ListGaugesLeft";
import GaugeForm from "./GaugeForm";
import ViewGauge from "./ViewGauge";
import ViewGaugeLeft from "./ViewGaugeLeft";

export const gaugeRoutes = (
  <Route path="gauges" name="Gauges">
    <IndexRoute breadcrumbIgnore={true} components={{content: ListGauges, left: ListGaugesLeft}}/>
    <Route path="new" name="New gauge" components={{content: GaugeForm}}/>
    <Route path=":gaugeId" breadcrumbName=":gaugeId">
      <IndexRoute breadcrumbIgnore={true} components={{content: ViewGauge, left: ViewGaugeLeft}}/>
      <Route path="settings" name="Settings" components={{content: GaugeForm, left: ViewGaugeLeft}}/>
    </Route>
  </Route>
);