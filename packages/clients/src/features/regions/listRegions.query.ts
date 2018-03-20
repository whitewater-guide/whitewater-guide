import gql from 'graphql-tag';

export default gql`
  query listRegions($language:String, $page: Page) {
    regions(language: $language, page: $page) {
      nodes {
        id
        language
        name
        hidden
        rivers { count }
        gauges { count }
        sections { count }
      }
      count
    }
  }
`;
