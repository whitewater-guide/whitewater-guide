import gql from 'graphql-tag';

export const GAUGE_NAME = gql`
  query gaugeName($id: ID!) {
    gauge(id: $id) {
      id
      name
    }
  }
`;
