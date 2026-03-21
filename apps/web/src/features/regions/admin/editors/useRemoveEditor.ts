import { useCallback } from 'react';

import { useRemoveEditorMutation } from './removeEditor.generated';

export default function useRemoveEditor(regionId: string) {
  const [mutate] = useRemoveEditorMutation({
    refetchQueries: ['regionEditors'],
  });

  return useCallback(
    (userId: string) => mutate({ variables: { regionId, userId } }),
    [regionId, mutate],
  );
}
