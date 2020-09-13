import { MediaInput } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const UPSERT_MEDIA = gql`
  mutation upsertMedia($sectionId: ID!, $media: MediaInput!) {
    upsertSectionMedia(sectionId: $sectionId, media: $media) {
      id
      kind
      description
      copyright
      url
      weight
    }
  }
`;

export interface MVars {
  sectionId: string;
  media: MediaInput;
}
