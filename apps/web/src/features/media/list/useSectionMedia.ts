import { useCallback } from 'react';

import { useDeleteMutation } from '../../../apollo';
import { THUMB_HEIGHT } from '../components/list/constants';
import { RemoveMediaDocument } from './removeMedia.generated';
import {
  SectionMediaDocument,
  useSectionMediaQuery,
} from './sectionMedia.generated';

export default function useSectionMedia(sectionId: string) {
  const { data, loading } = useSectionMediaQuery({
    fetchPolicy: 'cache-and-network',
    variables: { sectionId, thumbHeight: THUMB_HEIGHT },
  });

  const removeMediaById = useDeleteMutation(RemoveMediaDocument, [
    {
      query: SectionMediaDocument,
      variables: { sectionId, thumbHeight: THUMB_HEIGHT },
    },
  ]);

  const media = data?.media?.nodes;

  const removeMedia = useCallback(
    (index: number) => {
      const item = media?.[index];
      if (!item) {
        return;
      }
      removeMediaById(item.id);
    },
    [removeMediaById, media],
  );

  return { media, loading, removeMedia };
}
