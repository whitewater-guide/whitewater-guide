import gql from 'graphql-tag';

export const REMOVE_REGION = gql`
  mutation removeRegion($id: ID!) {
    removeRegion(id: $id)
  }
`;

export interface MVars {
  id?: string;
}
