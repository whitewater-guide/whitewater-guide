import gql from 'graphql-tag';

const UPSERT_MEDIA = gql`
  mutation upsertMedia($sectionId: ID!, $media: MediaInput!, $language: String) {
    upsertSectionMedia(sectionId: $sectionId, media: $media, language: $language) {
      id
      language
      kind
      description
      copyright
      url
      weight
    }
  }
`;

export default UPSERT_MEDIA;
