import { gql } from 'react-apollo';

export const REGION_NAME = gql`
  query regionName($id: ID!, $language:String) {
    region(id: $id, language: $language) {
      id
      language
      name
    }
  }
`;
