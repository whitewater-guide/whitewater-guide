import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { PrivateRoute } from '../../layout';
import { RiverForm } from './form';
import RiverRoute from './RiverRoute';
import { RiversList } from './list';

export const RiversRoute: React.StatelessComponent<RouteComponentProps<any>> = (props) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return (
    path.includes('/regions/') ?
      (
        <Switch>
          <PrivateRoute exact path={`${path}new`} component={RiverForm} />
          <Route path={`${path}:riverId`} component={RiverRoute} />
        </Switch>
      ) :
      (
        <Route exact path={`${path}`} component={RiversList} />
      )
  );
};
