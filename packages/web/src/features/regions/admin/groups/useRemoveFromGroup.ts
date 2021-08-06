import { useCallback } from 'react';

import { useRemoveRegionFromGroupMutation } from './removeRegionFromGroup.generated';

export default (regionId: string) => {
  const [mutate] = useRemoveRegionFromGroupMutation({
    refetchQueries: ['regionGroups'],
  });
  return useCallback(
    (groupId: string) => mutate({ variables: { regionId, groupId } }),
    [mutate, regionId],
  );
};
