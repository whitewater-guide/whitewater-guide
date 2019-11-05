import { Media } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const MEDIA_FORM_QUERY = gql`
  query mediaForm($mediaId: ID) {
    media(id: $mediaId) {
      id
      kind
      description
      copyright
      url
      weight
      resolution
    }
  }
`;

export interface QVars {
  mediaId?: string;
}

export interface QResult {
  media: Pick<
    Media,
    | 'id'
    | 'kind'
    | 'description'
    | 'copyright'
    | 'url'
    | 'weight'
    | 'resolution'
  >;
}
