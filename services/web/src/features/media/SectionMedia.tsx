import Box from '@material-ui/core/Box';
import React, { Suspense } from 'react';
import { Route } from 'react-router';
import useRouter from 'use-react-router';
import { Loading } from '../../components';
import MediaForm from './form';
import { MediaListWithData } from './list';

export const SectionMedia: React.FC = () => {
  const { match } = useRouter();
  return (
    <Box padding={1}>
      <Suspense fallback={<Loading />}>
        <MediaListWithData />
        <Route strict={true} path={`${match.path}/new`} component={MediaForm} />
        <Route
          strict={true}
          path={`${match.path}/:mediaId/settings`}
          component={MediaForm}
        />
      </Suspense>
    </Box>
  );
};
