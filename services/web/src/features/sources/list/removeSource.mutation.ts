import gql from 'graphql-tag';

const REMOVE_SOURCE = gql`
  mutation removeSource($id: ID!) {
    removeSource(id: $id)
  }
`;

export default REMOVE_SOURCE;
