import { Connection, Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const REGIONS_LIST_QUERY = gql`
  query regionsList($page: Page) {
    regions(page: $page) {
      nodes {
        id
        name
        premium
        hasPremiumAccess
        sku
        gauges {
          count
        }
        sections {
          count
        }
        coverImage {
          mobile
        }
      }
      count
    }
  }
`;

export interface Result {
  regions: Connection<Region>;
}
