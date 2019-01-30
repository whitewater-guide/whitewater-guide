import gql from 'graphql-tag';

const REMOVE_GAUGE = gql`
  mutation removeGauge($id: ID!) {
    removeGauge(id: $id)
  }
`;

export default REMOVE_GAUGE;
