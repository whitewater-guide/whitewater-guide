import { gql } from 'react-apollo';

const REMOVE_SOURCE = gql`
  mutation removeSource($id: ID!){
    removeSource(id: $id)
  }
`;

export default REMOVE_SOURCE;
