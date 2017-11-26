import { gql } from 'react-apollo';

export const REMOVE_TAG = gql`
  mutation upsertRegion($id: String!){
    removeTag(id: $id)
  }
`;
