import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import { RegionOfflineDateFragmentDoc } from '../regionOfflineDate.generated';

export default function useUpdateOfflineDate(unset = false) {
  const client = useApolloClient();

  return useCallback(
    (regionId: string) => {
      client.writeFragment({
        id: client.cache.identify({ __typename: 'Region', id: regionId }),
        fragment: RegionOfflineDateFragmentDoc,
        data: {
          __typename: 'Region',
          id: regionId,
          offlineDate: unset ? null : new Date().toISOString(),
        },
        broadcast: true,
      });
    },
    [client, unset],
  );
}
