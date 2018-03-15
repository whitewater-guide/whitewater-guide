import gql from 'graphql-tag';

const MEDIA_FORM_QUERY = gql`
  query mediaForm($id: ID, $language: String) {
    media(id: $id, language: $language) {
      id
      language
      kind
      description
      copyright
      url
      weight
    }

    mediaForm(id: $id) {
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
