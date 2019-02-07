import {
  Connection,
  NamedNode,
  Page,
  RegionsFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const FIND_REGIONS_QUERY = gql`
  query findRegions($filter: RegionsFilter, $page: Page) {
    regions(filter: $filter, page: $page) {
      nodes {
        id
        name
      }
    }
  }
`;

export interface QVars {
  filter: RegionsFilter;
  page: Page;
}

export interface QResult {
  regions: Connection<NamedNode>;
}
