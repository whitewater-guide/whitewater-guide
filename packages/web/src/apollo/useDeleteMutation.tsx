import { DocumentNode } from 'graphql';
import { useCallback } from 'react';
import { MutationHookOptions, useMutation } from 'react-apollo';

interface MVars {
  id: string;
}

export const useDeleteMutation = (
  mutation: DocumentNode,
  refetchQueries?: MutationHookOptions['refetchQueries'],
) => {
  const [mutate] = useMutation<unknown, MVars>(mutation, {
    refetchQueries,
  });
  return useCallback(
    (id: string) => {
      mutate({ variables: { id } }).catch(() => {
        // ignore errors
      });
    },
    [mutate],
  );
};
