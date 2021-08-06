import { useMemo } from 'react';

import { useToggleSourceMutation } from './toggleSource.generated';

export default function useToggleSource() {
  const [mutate] = useToggleSourceMutation();
  return useMemo(
    () => async (id: string, enabled: boolean) => {
      await mutate({ variables: { id, enabled } }).catch(() => {
        // ignore, maybe show snackbar later
      });
    },
    [mutate],
  );
}
