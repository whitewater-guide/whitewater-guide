import gql from 'graphql-tag';

export const SOURCE_NAME = gql`
  query sourceName($id: ID!, $language:String) {
    source(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
