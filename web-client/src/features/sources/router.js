import React from 'react'
import {Route, IndexRoute} from 'react-router';
import ListSources from "./ListSources";
import ListSourcesLeft from "./ListSourcesLeft";
import SourceForm from "./SourceForm";
import ViewSource from "./ViewSource";
import ViewSourceLeft from "./ViewSourceLeft";
import SourceSchedule from "./SourceSchedule";
import TermsOfUse from "./TermsOfUse";

export const sourcesRoutes = (
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
);