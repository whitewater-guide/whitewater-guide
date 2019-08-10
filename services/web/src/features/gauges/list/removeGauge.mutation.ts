import gql from 'graphql-tag';

export const REMOVE_GAUGE = gql`
  mutation removeGauge($id: ID!) {
    removeGauge(id: $id)
  }
`;
