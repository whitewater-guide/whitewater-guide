import { Connection, Group } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const LIST_GROUPS = gql`
  query listGroups($regionId: ID) {
    groups(regionId: $regionId) {
      nodes {
        id
        name
        sku
        regions {
          nodes {
            id
            name
          }
        }
      }
      count
    }
  }
`;

export interface QVars {
  regionId: string;
}

export interface QResult {
  groups: Required<Connection<Group>>;
}
