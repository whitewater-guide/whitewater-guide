import { useRegion } from '@whitewater-guide/clients';
import React, { useMemo } from 'react';
import { useQuery } from 'react-apollo';
import ErrorBoundary from 'react-error-boundary';
import useRouter from 'use-react-router';
import { useDeleteMutation } from '../../../apollo';
import { Loading } from '../../../components';
import { squashConnection } from '../../../formik/utils';
import { THUMB_HEIGHT } from './constants';
import MediaList from './MediaList';
import { REMOVE_MEDIA } from './removeMedia.mutation';
import { QResult, QVars, SECTIONS_MEDIA } from './sectionsMedia.query';

interface RouterParams {
  sectionId: string;
  regionId: string;
}

export const MediaListWithData: React.FC = React.memo(() => {
  const { history, match } = useRouter<RouterParams>();
  const { regionId, sectionId } = match.params;
  const { node: region } = useRegion();
  const { data, loading } = useQuery<QResult, QVars>(SECTIONS_MEDIA, {
    fetchPolicy: 'cache-and-network',
    variables: { sectionId, thumbHeight: THUMB_HEIGHT },
  });
  const removeMedia = useDeleteMutation(REMOVE_MEDIA, [
    {
      query: SECTIONS_MEDIA,
      variables: { sectionId, thumbHeight: THUMB_HEIGHT },
    },
  ]);
  const media = useMemo(() => squashConnection(data, 'media'), [data]);
  if (loading) {
    return <Loading />;
  }
  return (
    <ErrorBoundary>
      <MediaList
        regionId={regionId}
        sectionId={sectionId}
        media={media}
        editable={!!region && region.editable}
        history={history}
        onRemove={removeMedia}
      />
    </ErrorBoundary>
  );
});

MediaListWithData.displayName = 'MediaListWithData';
