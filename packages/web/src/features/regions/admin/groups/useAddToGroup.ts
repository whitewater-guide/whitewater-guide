import { NamedNode } from '@whitewater-guide/schema';
import { useCallback } from 'react';

import { useAddRegionToGroupMutation } from './addRegionToGroup.generated';

export default (regionId: string) => {
  const [mutate] = useAddRegionToGroupMutation({
    refetchQueries: ['regionGroups'],
  });
  return useCallback(
    (group: NamedNode) =>
      mutate({ variables: { regionId, groupId: group.id } }),
    [mutate, regionId],
  );
};
