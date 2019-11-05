import { useRegion } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/commons';
import React, { Suspense, useCallback } from 'react';
import ErrorBoundary from 'react-error-boundary';
import useRouter from 'use-react-router';
import { Loading } from '../../../components';
import { LocalPhoto } from '../../../utils/files';
import { LazyMediaList } from '../components/list';
import useSectionMedia from './useSectionMedia';

interface RouterParams {
  sectionId: string;
  regionId: string;
}

export const MediaListWithData: React.FC = React.memo(() => {
  const { history, match } = useRouter<RouterParams>();
  const { regionId, sectionId } = match.params;
  const { node: region } = useRegion();
  const { media, loading, removeMedia } = useSectionMedia(sectionId);

  const onEdit = useCallback(
    (index: number) => {
      const item = media[index];
      if (item) {
        history.push(
          `/regions/${regionId}/sections/${sectionId}/media/${item.id}/settings`,
        );
      }
    },
    [media, regionId, sectionId, history],
  );

  const onAdd = useCallback(
    (kind: MediaKind, file?: LocalPhoto) => {
      history.push(
        `/regions/${regionId}/sections/${sectionId}/media/new?kind=${kind}`,
        { file },
      );
    },
    [regionId, sectionId, history],
  );

  if (loading) {
    return <Loading />;
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyMediaList
          media={media}
          editable={!!region && region.editable}
          onRemove={removeMedia}
          onEdit={onEdit}
          onAdd={onAdd}
        />
      </Suspense>
    </ErrorBoundary>
  );
});

MediaListWithData.displayName = 'MediaListWithData';
