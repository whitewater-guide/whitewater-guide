import { Connection, Media } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-apollo';

import { useDeleteMutation } from '../../../apollo';
import { squashConnection } from '../../../formik/utils';
import { THUMB_HEIGHT } from '../components/list/constants';

const SECTIONS_MEDIA = gql`
  query sectionMedia($sectionId: ID!, $thumbHeight: Int) {
    media: mediaBySection(sectionId: $sectionId) {
      nodes {
        id
        kind
        description
        copyright
        createdAt
        weight
        url
        image
        thumb: image(height: $thumbHeight)
        resolution
        deleted
      }
    }
  }
`;

const REMOVE_MEDIA = gql`
  mutation removeMedia($id: ID!) {
    removeMedia(id: $id) {
      id
      deleted
    }
  }
`;

interface Vars {
  sectionId: string;
  thumbHeight: number;
}

interface Result {
  media: Required<Connection<Media>>;
}

export default (sectionId: string) => {
  const { data, loading } = useQuery<Result, Vars>(SECTIONS_MEDIA, {
    fetchPolicy: 'cache-and-network',
    variables: { sectionId, thumbHeight: THUMB_HEIGHT },
  });

  const removeMediaById = useDeleteMutation(REMOVE_MEDIA, [
    {
      query: SECTIONS_MEDIA,
      variables: { sectionId, thumbHeight: THUMB_HEIGHT },
    },
  ]);

  const media = useMemo(() => squashConnection(data, 'media'), [data]);

  const removeMedia = useCallback(
    (index: number) => {
      const item = media[index];
      if (!item) {
        return;
      }
      removeMediaById(item.id);
    },
    [removeMediaById, media],
  );

  return { media, loading, removeMedia };
};
