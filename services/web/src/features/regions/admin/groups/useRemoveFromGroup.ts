import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const REMOVE_REGION_FROM_GROUP_MUTATION = gql`
  mutation removeRegionFromGroup($regionId: ID!, $groupId: ID!) {
    removeRegionFromGroup(regionId: $regionId, groupId: $groupId)
  }
`;

interface MVars {
  regionId: string;
  groupId: string;
}

export default (regionId: string) => {
  const [mutate] = useMutation<any, MVars>(REMOVE_REGION_FROM_GROUP_MUTATION, {
    refetchQueries: ['regionGroups'],
  });
  return useCallback(
    (groupId: string) => mutate({ variables: { regionId, groupId } }),
    [mutate, regionId],
  );
};
