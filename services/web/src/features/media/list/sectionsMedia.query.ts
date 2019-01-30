import gql from 'graphql-tag';

const SECTIONS_MEDIA = gql`
  query sectionMedia($sectionId: ID!) {
    mediaBySection(sectionId: $sectionId) {
      nodes {
        id
        kind
        description
        copyright
        createdAt
        weight
        url
        resolution
        deleted
      }
    }
  }
`;

export default SECTIONS_MEDIA;
