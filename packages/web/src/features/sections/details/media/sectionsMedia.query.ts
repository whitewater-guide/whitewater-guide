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
        thumb(options: { height: 128, width: 128 })
        deleted
      }
    }
  }
`;

export default SECTIONS_MEDIA;
