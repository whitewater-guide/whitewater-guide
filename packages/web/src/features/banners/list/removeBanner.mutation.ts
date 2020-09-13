import gql from 'graphql-tag';

export const REMOVE_BANNER = gql`
  mutation removeBanner($id: ID!) {
    removeBanner(id: $id) {
      id
      deleted
    }
  }
`;

export interface MVars {
  id: string;
}
