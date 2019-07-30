import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { MVars, TOGGLE_GAUGE } from './toggleGauge.mutation';

export default () => {
  const [mutate] = useMutation<any, MVars>(TOGGLE_GAUGE);
  return useCallback(
    (id: string, enabled: boolean) => mutate({ variables: { id, enabled } }),
    [mutate],
  );
};
