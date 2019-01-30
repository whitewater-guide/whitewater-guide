import gql from 'graphql-tag';

const UPSERT_MEDIA = gql`
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

export default UPSERT_MEDIA;
