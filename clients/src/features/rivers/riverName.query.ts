import gql from 'graphql-tag';

export const RIVER_NAME = gql`
  query riverName($id: ID!, $language:String) {
    river(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
