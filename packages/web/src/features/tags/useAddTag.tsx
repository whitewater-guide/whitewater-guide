import { TagInput } from '@whitewater-guide/schema';
import { useCallback } from 'react';

import { useUpsertTagMutation } from './upsertTag.generated';

export default () => {
  const [mutate] = useUpsertTagMutation();
  return useCallback(
    (tag: TagInput) =>
      mutate({
        variables: { tag },
        refetchQueries: ['listTags'],
      }),
    [mutate],
  );
};
