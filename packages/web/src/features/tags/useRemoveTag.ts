import { useCallback } from 'react';

import { useRemoveTagMutation } from './removeTag.generated';

export default () => {
  const [mutate] = useRemoveTagMutation();
  return useCallback(
    (id: string) =>
      mutate({
        variables: { id },
        refetchQueries: ['listTags'],
      }),
    [mutate],
  );
};
