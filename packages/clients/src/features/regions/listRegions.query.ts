import gql from 'graphql-tag';

export default gql`
  query listRegions($page: Page) {
    regions(page: $page) {
      nodes {
        id
        name
        hidden
        premium
        hasPremiumAccess
        editable
        sku
        rivers { count }
        gauges { count }
        sections { count }
      }
      count
    }
  }
`;
