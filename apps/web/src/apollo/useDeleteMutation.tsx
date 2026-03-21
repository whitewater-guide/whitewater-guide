import type { MutationHookOptions } from '@apollo/client';
import { useMutation } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { useCallback } from 'react';

export function useDeleteMutation(
  mutation: DocumentNode,
  refetchQueries?: MutationHookOptions['refetchQueries'],
): (id: string) => void {
  const [mutate] = useMutation(mutation, {
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
}
