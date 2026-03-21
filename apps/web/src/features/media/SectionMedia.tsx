import Box from '@material-ui/core/Box';
import React, { Suspense } from 'react';
import { Route, useRouteMatch } from 'react-router';

import { Loading } from '../../components';
import MediaForm from './form';
import { MediaListWithData } from './list';

export const SectionMedia: React.FC = () => {
  const match = useRouteMatch();
  return (
    <Box padding={1}>
      <Suspense fallback={<Loading />}>
        <MediaListWithData />
        <Route strict path={`${match.path}/new`} component={MediaForm} />
        <Route
          strict
          path={`${match.path}/:mediaId/settings`}
          component={MediaForm}
        />
      </Suspense>
    </Box>
  );
};
