import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import { SectionForm } from './form';
import { SectionsList } from './list';
import SectionRoute from './SectionRoute';

export const SectionsRoute: React.StatelessComponent<RouteComponentProps<any>> = (props) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return (
    path.includes('/regions/') ?
      (
        <Switch>
          <PrivateRoute exact path={`${path}new`} component={SectionForm} />
          <Route path={`${path}:sectionId`} component={SectionRoute} />
        </Switch>
      ) :
      (
        <Route exact path={`${path}`} component={SectionsList} />
      )
  );
};
