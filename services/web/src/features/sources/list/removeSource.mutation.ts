import gql from 'graphql-tag';

export const REMOVE_SOURCE = gql`
  mutation removeSource($id: ID!) {
    removeSource(id: $id)
  }
`;
