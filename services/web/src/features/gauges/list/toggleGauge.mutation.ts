import gql from 'graphql-tag';

export const TOGGLE_GAUGE = gql`
  mutation toggleGauge($id: ID!, $enabled: Boolean!) {
    toggleGauge(id: $id, enabled: $enabled) {
      id
      enabled
    }
  }
`;

export interface MVars {
  id: string;
  enabled: boolean;
}
