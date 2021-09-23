import {
  RegionProvider,
  SectionsFilterProvider,
  useRegionQuery,
} from '@whitewater-guide/clients';
import React, { FC, Suspense } from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import RegionAdmin from './admin';
import RegionDetailsRouter from './details';
import RegionForm from './form';

type Props = RouteComponentProps<{ regionId: string }>;

const RegionRouteInternal: FC = () => {
  const { loading } = useRegionQuery();
  const { path } = useRouteMatch();

  if (loading) {
    return <Loading />;
  }

  return (
    <Switch>
      <EditorRoute exact path={`${path}/settings`} component={RegionForm} />
      <AdminRoute exact path={`${path}/admin`} component={RegionAdmin} />
      <Route component={RegionDetailsRouter} />
    </Switch>
  );
};

const RegionRoute = React.memo<Props>(({ match }) => {
  return (
    <Suspense fallback={<Loading />}>
      <SectionsFilterProvider>
        <RegionProvider regionId={match.params.regionId}>
          <RegionRouteInternal />
        </RegionProvider>
      </SectionsFilterProvider>
    </Suspense>
  );
});

RegionRoute.displayName = 'RegionRoute';

export default RegionRoute;
