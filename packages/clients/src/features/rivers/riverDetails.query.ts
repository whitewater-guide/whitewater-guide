import gql from 'graphql-tag';

export const RIVER_DETAILS = gql`
  query viewRiverQuery($riverId: ID, $language:String ) {
    river(id: $riverId, language: $language) {
      id
      language
      name
      altNames
      region {
        id
        language
        name
      }
      createdAt
      updatedAt
    }
  }
`;
