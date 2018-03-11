import gql from 'graphql-tag';

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
        thumb(options: { height: 128, width: 512, resize: fit })
        deleted
      }
    }
  }
`;

export default SECTIONS_MEDIA;
