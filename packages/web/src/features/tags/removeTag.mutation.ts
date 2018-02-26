import gql from 'graphql-tag';

export const REMOVE_TAG = gql`
  mutation upsertRegion($id: String!){
    removeTag(id: $id)
  }
`;
