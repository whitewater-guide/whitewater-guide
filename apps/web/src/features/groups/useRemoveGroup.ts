import { useCallback } from 'react';

import { useRemoveGroupMutation } from './removeGroup.generated';

export default function useRemoveGroup() {
  const [mutate] = useRemoveGroupMutation({
    refetchQueries: ['listGroups'],
  });
  return useCallback(
    (id: string) =>
      mutate({
        variables: { id },
      }),
    [mutate],
  );
}
