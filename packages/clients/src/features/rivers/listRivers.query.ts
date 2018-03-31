import gql from 'graphql-tag';

export const LIST_RIVERS = gql`
  query listRivers($page: Page, $filter: RiversFilter) {
    rivers(page: $page, filter: $filter) {
      nodes {
        id
        name
        altNames
        region {
          id
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
