import gql from 'graphql-tag';

export const REMOVE_RIVER = gql`
  mutation removeRiver($id: ID!) {
    removeRiver(id: $id)
  }
`;

export interface MVars {
  id: string;
}
