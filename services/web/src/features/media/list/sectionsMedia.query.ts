import gql from 'graphql-tag';

const SECTIONS_MEDIA = gql`
  query sectionMedia($sectionId: ID!, $thumbHeight: Int) {
    mediaBySection(sectionId: $sectionId) {
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

export default SECTIONS_MEDIA;
