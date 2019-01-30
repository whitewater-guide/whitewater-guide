import gql from 'graphql-tag';

export const REMOVE_REGION_FROM_GROUP_MUTATION = gql`
  mutation removeRegionFromGroup($regionId: ID!, $groupId: ID!) {
    removeRegionFromGroup(regionId: $regionId, groupId: $groupId)
  }
`;

export interface RemoveGroupVars {
  regionId: string;
  groupId: string;
}

export interface RemoverGroupProps {
  removeGroup: (groupId: string) => void;
}
