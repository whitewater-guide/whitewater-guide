import React from 'react';
import {Route, IndexRoute} from 'react-router';
import ListSections from "./ListSections";
import SectionsLeft from "./SectionsLeft";
import SectionForm from "./SectionForm";
import ViewSection from "./ViewSection";

export const sectionRoutes = (
  <Route path="sections" name="Sections">
    <IndexRoute breadcrumbIgnore={true} components={{content: ListSections, left: SectionsLeft}}/>
    <Route path="new" name="New Section" components={{content: SectionForm, left: SectionsLeft}}/>
    <Route path=":sectionId" breadcrumbName=":sectionId">
      <IndexRoute breadcrumbIgnore={true} components={{content: ViewSection, left: SectionsLeft}}/>
      <Route path="settings" breadcrumbName="Settings" components={{content: SectionForm, left: SectionsLeft}}/>
    </Route>
  </Route>
);