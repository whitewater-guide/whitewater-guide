import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { MVars, TOGGLE_SOURCE } from './toggleSource.mutation';

export default () => {
  const [mutate] = useMutation<any, MVars>(TOGGLE_SOURCE);
  return useCallback(
    (id: string, enabled: boolean) =>
      mutate({ variables: { id, enabled } }).catch(() => {}),
    [mutate],
  );
};
