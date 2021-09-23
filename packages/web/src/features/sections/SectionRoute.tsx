import { SectionProvider, useSectionQuery } from '@whitewater-guide/clients';
import React, { FC, Suspense } from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { Loading } from '../../components';
import { AdminRoute, EditorRoute } from '../../layout';
import SectionAdmin from './admin';
import SectionDetails from './details';
import SectionForm from './form';

type Props = RouteComponentProps<{ sectionId: string }>;

const SectionRouteInternal: FC = () => {
  const { path } = useRouteMatch();
  const { loading } = useSectionQuery();

  if (loading) {
    return <Loading />;
  }

  return (
    <Switch>
      <EditorRoute exact path={`${path}/settings`} component={SectionForm} />
      <AdminRoute exact path={`${path}/admin`} component={SectionAdmin} />
      <Route component={SectionDetails} />
    </Switch>
  );
};

const SectionRoute: FC<Props> = ({ match }) => {
  return (
    <Suspense fallback={<Loading />}>
      <SectionProvider sectionId={match.params.sectionId}>
        <SectionRouteInternal />
      </SectionProvider>
    </Suspense>
  );
};

export default SectionRoute;
