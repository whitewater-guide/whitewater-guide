import { Connection, Page, Region } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_REGIONS = gql`
  query listRegions($page: Page) {
    regions(page: $page) {
      nodes {
        id
        name
        hidden
        premium
        hasPremiumAccess
        editable
        rivers {
          count
        }
        gauges {
          count
        }
        sections {
          count
        }
      }
      count
    }
  }
`;

export interface QVars {
  page?: Page;
}

export type ListedRegion = Pick<
  Region,
  'id' | 'name' | 'hidden' | 'premium' | 'hasPremiumAccess' | 'editable'
> & {
  rivers: { count: number };
  gauges: { count: number };
  sections: { count: number };
};

export interface QResult {
  regions: Required<Connection<ListedRegion>>;
}
