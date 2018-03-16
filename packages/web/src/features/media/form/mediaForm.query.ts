import gql from 'graphql-tag';

const MEDIA_FORM_QUERY = gql`
  query mediaForm($mediaId: ID, $language: String) {
    media(id: $mediaId, language: $language) {
      id
      language
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
