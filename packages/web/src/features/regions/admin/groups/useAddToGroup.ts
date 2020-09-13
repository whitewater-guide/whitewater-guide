import { NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

const ADD_REGION_TO_GROUP_MUTATION = gql`
  mutation addRegionToGroup($regionId: ID!, $groupId: ID!) {
    addRegionToGroup(regionId: $regionId, groupId: $groupId)
  }
`;

interface MVars {
  regionId: string;
  groupId: string;
}

export default (regionId: string) => {
  const [mutate] = useMutation<any, MVars>(ADD_REGION_TO_GROUP_MUTATION, {
    refetchQueries: ['regionGroups'],
  });
  return useCallback(
    (group: NamedNode) =>
      mutate({ variables: { regionId, groupId: group.id } }),
    [mutate, regionId],
  );
};
