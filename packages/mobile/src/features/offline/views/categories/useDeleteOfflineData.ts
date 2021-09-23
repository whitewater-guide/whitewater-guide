import { useApolloClient } from '@apollo/client';
import { sleep } from '@whitewater-guide/clients';
import { InteractionManager } from 'react-native';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { useUpdateOfflineDate } from '../../hooks';

export default function useDeleteOfflineData(regionId: string) {
  const client = useApolloClient();
  const unsetOfflineDate = useUpdateOfflineDate(true);

  // Make it look async because it's slow and blocking
  return useAsyncFn(async () => {
    await sleep(500);
    await InteractionManager.runAfterInteractions(() => {
      client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'sections',
        broadcast: false,
        args: {
          filter: {
            regionId,
          },
        },
      });
      client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'region',
        broadcast: false,
        args: {
          id: regionId,
        },
      });

      unsetOfflineDate(regionId);
      client.cache.gc();
    });
  }, [regionId, client, unsetOfflineDate]);
}
