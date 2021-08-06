import {
  RegionProvider,
  SectionsFilterProvider,
} from '@whitewater-guide/clients';
import React, { Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import RegionAdmin from './admin';
import RegionDetailsRouter from './details';
import RegionForm from './form';

type Props = RouteComponentProps<{ regionId: string }>;

const RegionRoute = React.memo<Props>((props) => {
  const {
    match: { path, params },
  } = props;
  return (
    <Suspense fallback={<Loading />}>
      <SectionsFilterProvider>
        <RegionProvider regionId={params.regionId}>
          {({ loading }) => {
            if (loading) {
              return <Loading />;
            }
            return (
              <Switch>
                <EditorRoute
                  exact
                  path={`${path}/settings`}
                  component={RegionForm}
                />
                <AdminRoute
                  exact
                  path={`${path}/admin`}
                  component={RegionAdmin}
                />
                <Route component={RegionDetailsRouter} />
              </Switch>
            );
          }}
        </RegionProvider>
      </SectionsFilterProvider>
    </Suspense>
  );
});

RegionRoute.displayName = 'RegionRoute';

export default RegionRoute;
