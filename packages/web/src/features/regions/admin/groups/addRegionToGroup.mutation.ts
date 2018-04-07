import gql from 'graphql-tag';

export const ADD_REGION_TO_GROUP_MUTATION = gql`
  mutation addRegionToGroup($regionId: ID!, $groupId: ID!) {
    addRegionToGroup(regionId: $regionId, groupId: $groupId)
  }
`;

export interface AddGroupVars {
  regionId: string;
  groupId: string;
}

export interface AddGroupProps {
  addGroup: (groupId: string) => void;
}
