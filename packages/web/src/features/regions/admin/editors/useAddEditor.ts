import { useCallback } from 'react';

import { useAddEditorMutation } from './addEditor.generated';

export default function useAddEditor(regionId: string) {
  const [mutate] = useAddEditorMutation();
  return useCallback(
    (userId: string) =>
      mutate({
        variables: { regionId, userId },
        refetchQueries: ['regionEditors'],
      }),
    [mutate, regionId],
  );
}
