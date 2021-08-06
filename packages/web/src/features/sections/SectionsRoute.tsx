import React, { Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { EditorRoute } from '../../layout';
import SectionForm from './form';
import SectionRoute from './SectionRoute';

export const SectionsRoute: React.FC<RouteComponentProps<any>> = (props) => {
  let { path } = props.match;
  if (!path.endsWith('/')) {
    path += '/';
  }
  return path.includes('/regions/') ? (
    <Suspense fallback={<Loading />}>
      <Switch>
        <EditorRoute exact path={`${path}new`} component={SectionForm} />
        <Route path={`${path}:sectionId`} component={SectionRoute} />
      </Switch>
    </Suspense>
  ) : null;
};
