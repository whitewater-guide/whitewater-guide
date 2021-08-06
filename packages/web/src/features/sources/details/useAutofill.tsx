import { useCallback } from 'react';

import { useAutofillSourceMutation } from './autofillSource.generated';

export default (sourceId: string) => {
  const [mutate] = useAutofillSourceMutation({
    variables: { sourceId },
    refetchQueries: ['listGauges'],
  });
  return useCallback(() => mutate(), [mutate]);
};
