import gql from 'graphql-tag';

export const LIST_RIVERS = gql`
  query listRivers($language:String, $page: Page, $filter: RiversFilter) {
    rivers(language: $language, page: $page, filter: $filter) {
      nodes {
        id
        language
        name
        altNames
        region {
          id
          language
          name
        }
        sections {
          count
        }
      }
      count
    }
  }
`;
