import gql from 'graphql-tag';
import { Group } from '../../../../ww-commons';

export const REGION_GROUPS_QUERY = gql`
  query regionGroups($regionId: ID!) {
    regionGroups: groups(regionId: $regionId) {
      id
      name
    }

    allGroups: groups {
      id
      name
    }
  }
`;

export interface RegionGroupsVars {
  regionId?: string;
}

export interface RegionGroupsResult {
  regionGroups: Group[];
  allGroups: Group[];
}

export interface RegionGroupsQueryProps {
  regionGroups: Group[];
  allGroups: Group[];
  groupsLoading: boolean;
}

export default REGION_GROUPS_QUERY;
