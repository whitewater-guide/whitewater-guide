import {
  Connection,
  NamedNode,
  Page,
  River,
  RiversFilter,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_RIVERS = gql`
  query listRivers($page: Page, $filter: RiversFilter) {
    rivers(page: $page, filter: $filter)
      @connection(key: "rivers", filter: ["filter"]) {
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

export interface QVars {
  page?: Page;
  filter?: RiversFilter;
}

export type ListedRiver = Pick<River, 'id' | 'name' | 'altNames'> & {
  region: NamedNode;
  sections: { count: number };
};

export interface QResult {
  rivers: Connection<ListedRiver>;
}
