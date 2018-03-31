import gql from 'graphql-tag';

export const RIVER_DETAILS = gql`
  query viewRiverQuery($riverId: ID ) {
    river(id: $riverId) {
      id
      name
      altNames
      region {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
