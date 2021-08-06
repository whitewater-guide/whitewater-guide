import React, { Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { EditorRoute } from '../../layout';
import RiverForm from './form';
import { RiversList } from './list';
import RiverRoute from './RiverRoute';

export const RiversRoute: React.FC<RouteComponentProps<any>> = (props) => {
  let { path } = props.match;
  if (!path.endsWith('/')) {
    path += '/';
  }
  return path.includes('/regions/') ? (
    <Suspense fallback={<Loading />}>
      <Switch>
        <EditorRoute exact path={`${path}new`} component={RiverForm} />
        <Route path={`${path}:riverId`} component={RiverRoute} />
      </Switch>
    </Suspense>
  ) : (
    <Route exact path={`${path}`} component={RiversList} />
  );
};
