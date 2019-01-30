import gql from 'graphql-tag';

const REMOVE_RIVER = gql`
  mutation removeRiver($id: ID!) {
    removeRiver(id: $id)
  }
`;

export default REMOVE_RIVER;
