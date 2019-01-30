import gql from 'graphql-tag';

const TOGGLE_SOURCE = gql`
  mutation toggleSource($id: ID!, $enabled: Boolean!) {
    toggleSource(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

export default TOGGLE_SOURCE;
