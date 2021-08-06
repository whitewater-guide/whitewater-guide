import { SuggestionStatus } from '@whitewater-guide/schema';
import { useMemo } from 'react';

import { useResolveSuggestionMutation } from './resolveSuggestion.generated';

const useResolveSuggestion = (id: string, callback: () => void) => {
  const [mutate] = useResolveSuggestionMutation();
  return useMemo(
    () => ({
      accept: () =>
        mutate({
          variables: { id, status: SuggestionStatus.Accepted },
        }).then(() => callback()),
      reject: () =>
        mutate({
          variables: { id, status: SuggestionStatus.Accepted },
        }).then(() => callback()),
    }),
    [id, callback, mutate],
  );
};

export default useResolveSuggestion;
