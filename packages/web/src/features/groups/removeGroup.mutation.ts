import gql from 'graphql-tag';

export const REMOVE_GROUP = gql`
  mutation upsertRegion($id: String!) {
    removeGroup(id: $id)
  }
`;
