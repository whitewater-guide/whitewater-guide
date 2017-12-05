import gql from 'graphql-tag';

export const REGION_NAME = gql`
  query regionName($id: ID!, $language:String) {
    region(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
