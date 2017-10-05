import { gql } from 'react-apollo';

const REMOVE_REGION = gql`
  mutation removeRegion($id: ID!){
    removeRegion(id: $id)
  }
`;

export default REMOVE_REGION;
