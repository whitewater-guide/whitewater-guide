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

export interface RegionGroupsVars {
  regionId?: string;
}

export interface RegionGroupsResult {
  regionGroups: Connection<Group>;
  allGroups: Connection<Group>;
}

export interface RegionGroupsQueryProps {
  regionGroups: Connection<Group>;
  allGroups: Connection<Group>;
  groupsLoading: boolean;
}

export default REGION_GROUPS_QUERY;
