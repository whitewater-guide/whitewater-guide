import { gql } from 'react-apollo';

export const LIST_TAGS = gql`
  query listTags($language: String) {
    tags(language: $language) {
      id
      language
      name
      category
    }
  }
`;
