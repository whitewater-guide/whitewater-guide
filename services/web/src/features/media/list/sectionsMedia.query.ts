import { Connection, Media } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const SECTIONS_MEDIA = gql`
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

export interface QVars {
  sectionId: string;
  thumbHeight: number;
}

export interface QResult {
  media: Required<Connection<Media>>;
}
