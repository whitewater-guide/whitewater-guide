import gql from 'graphql-tag';
import { THUMB_HEIGHT } from './constants';

const SECTIONS_MEDIA = gql`
  query sectionMedia($sectionId: ID!, $language: String) {
    mediaBySection(sectionId: $sectionId, language: $language) {
      nodes {
        id
        language
        kind
        description
        copyright
        createdAt
        weight
        url
        resolution
        thumb(options: { height: ${THUMB_HEIGHT}, width: ${4 * THUMB_HEIGHT}, resize: fit })
        deleted
      }
    }
  }
`;

export default SECTIONS_MEDIA;
