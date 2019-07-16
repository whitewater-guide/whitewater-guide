import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { EditorRoute } from '../../layout';
import { SectionForm } from './form';
import SectionRoute from './SectionRoute';

export const SectionsRoute: React.FC<RouteComponentProps<any>> = (props) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return path.includes('/regions/') ? (
    <Switch>
      <EditorRoute exact={true} path={`${path}new`} component={SectionForm} />
      <Route path={`${path}:sectionId`} component={SectionRoute} />
    </Switch>
  ) : null;
};
