import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { EditorRoute } from '../../layout';
import { RiverForm } from './form';
import { RiversList } from './list';
import RiverRoute from './RiverRoute';

export const RiversRoute: React.StatelessComponent<RouteComponentProps<any>> = (
  props,
) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return path.includes('/regions/') ? (
    <Switch>
      <EditorRoute exact path={`${path}new`} component={RiverForm} />
      <Route path={`${path}:riverId`} component={RiverRoute} />
    </Switch>
  ) : (
    <Route exact path={`${path}`} component={RiversList} />
  );
};
