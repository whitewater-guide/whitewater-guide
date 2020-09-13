import gql from 'graphql-tag';

export const TOGGLE_SOURCE = gql`
  mutation toggleSource($id: ID!, $enabled: Boolean!) {
    toggleSource(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

export interface MVars {
  id: string;
  enabled: boolean;
}
