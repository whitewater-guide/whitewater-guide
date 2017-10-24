import { gql } from 'react-apollo';

export const SOURCE_NAME = gql`
  query sourceName($id: ID!, $language:String) {
    source(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
