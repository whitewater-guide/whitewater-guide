import gql from 'graphql-tag';

const REMOVE_MEDIA = gql`
  mutation removeMedia($id: ID!){
    removeMedia(id: $id) {
      id
      deleted
    }
  }
`;

export default REMOVE_MEDIA;
