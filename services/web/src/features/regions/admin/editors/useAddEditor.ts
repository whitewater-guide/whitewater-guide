import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { ADD_EDITOR_MUTATION, MVars } from './addEditor.mutation';

export default (regionId: string) => {
  const [mutate] = useMutation<any, MVars>(ADD_EDITOR_MUTATION);
  return useCallback(
    (userId: string) =>
      mutate({
        variables: { regionId, userId },
        refetchQueries: ['regionEditors'],
      }),
    [mutate, regionId],
  );
};
