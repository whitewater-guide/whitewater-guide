import { useCallback } from 'react';
import { useMutation } from 'react-apollo';

import { MVars, REMOVE_EDITOR_MUTATION } from './removeEditor.mutation';

export default (regionId: string) => {
  const [mutate] = useMutation<any, MVars>(REMOVE_EDITOR_MUTATION, {
    refetchQueries: ['regionEditors'],
  });
  return useCallback(
    (userId: string) => mutate({ variables: { regionId, userId } }),
    [regionId, mutate],
  );
};
