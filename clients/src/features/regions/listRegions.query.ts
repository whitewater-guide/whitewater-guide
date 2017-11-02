import { gql } from 'react-apollo';

export default gql`
  query listRegions($language:String, $page: Page) {
    regions(language: $language, page: $page) {
      nodes {
        id
        language
        name
        hidden
        rivers { count }
      }
      count
    }
  }
`;
