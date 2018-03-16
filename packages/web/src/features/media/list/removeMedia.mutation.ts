import gql from 'graphql-tag';

const REMOVE_MEDIA = gql`
  mutation removeMedia($id: ID!){
    removeMedia(id: $id) {
      id
      language
      deleted
    }
  }
`;

export default REMOVE_MEDIA;
