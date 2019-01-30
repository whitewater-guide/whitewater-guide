import gql from 'graphql-tag';

const MEDIA_FORM_QUERY = gql`
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

    mediaForm(id: $mediaId) {
      id
      upload {
        formData
        key
        postURL
      }
    }
  }
`;

export default MEDIA_FORM_QUERY;
