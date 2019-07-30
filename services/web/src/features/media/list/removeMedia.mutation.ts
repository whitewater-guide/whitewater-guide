import gql from 'graphql-tag';

export const REMOVE_MEDIA = gql`
  mutation removeMedia($id: ID!) {
    removeMedia(id: $id) {
      id
      deleted
    }
  }
`;
