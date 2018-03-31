import gql from 'graphql-tag';

export const RIVER_NAME = gql`
  query riverName($id: ID!) {
    river(id: $id) {
      id
      name
      altNames
    }
  }
`;
