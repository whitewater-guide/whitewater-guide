import React, { Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Loading } from '../../components';
import { EditorRoute } from '../../layout';
import RiverForm from './form';
import { RiversList } from './list';
import RiverRoute from './RiverRoute';

export const RiversRoute: React.FC<RouteComponentProps<any>> = (props) => {
  let path = props.match.path;
  if (!path.endsWith('/')) {
    path = path + '/';
  }
  return path.includes('/regions/') ? (
    <Suspense fallback={<Loading />}>
      <Switch>
        <EditorRoute exact={true} path={`${path}new`} component={RiverForm} />
        <Route path={`${path}:riverId`} component={RiverRoute} />
      </Switch>
    </Suspense>
  ) : (
    <Route exact={true} path={`${path}`} component={RiversList} />
  );
};
