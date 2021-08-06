import { GroupInput } from '@whitewater-guide/schema';
import { useCallback } from 'react';

import { useUpsertGroupMutation } from './upsertGroup.generated';

export default function useAddGroup() {
  const [mutate] = useUpsertGroupMutation({
    refetchQueries: ['listGroups'],
  });
  return useCallback(
    (group: GroupInput) =>
      mutate({
        variables: { group },
      }),
    [mutate],
  );
}
