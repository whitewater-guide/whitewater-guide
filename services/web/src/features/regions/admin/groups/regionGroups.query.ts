import { Connection, Group } from '@whitewater-guide/commons';
import gql from 'graphql-tag';

export const REGION_GROUPS_QUERY = gql`
  query regionGroups($regionId: ID!) {
    regionGroups: groups(regionId: $regionId) {
      nodes {
        id
        name
      }
    }

    allGroups: groups {
      nodes {
        id
        name
      }
    }
  }
`;

export interface QVars {
  regionId?: string;
}

export interface QResult {
  regionGroups: Required<Connection<Group>>;
  allGroups: Required<Connection<Group>>;
}
