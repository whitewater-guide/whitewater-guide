import { SectionProvider } from '@whitewater-guide/clients';
import React, { Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import SectionAdmin from './admin';
import SectionDetails from './details';
import SectionForm from './form';

type Props = RouteComponentProps<{ sectionId: string }>;

const SectionRoute: React.FC<Props> = (props) => {
  const {
    match: { path, params },
  } = props;

  return (
    <Suspense fallback={<Loading />}>
      <SectionProvider sectionId={params.sectionId}>
        {({ loading }) => {
          if (loading) {
            return <Loading />;
          }
          return (
            <Switch>
              <EditorRoute
                exact={true}
                path={`${path}/settings`}
                component={SectionForm}
              />
              <AdminRoute
                exact={true}
                path={`${path}/admin`}
                component={SectionAdmin}
              />
              <Route component={SectionDetails} />
            </Switch>
          );
        }}
      </SectionProvider>
    </Suspense>
  );
};

export default SectionRoute;