import { useApolloClient } from '@apollo/client';

import { RegionOfflineDateFragmentDoc } from '../regionOfflineDate.generated';

/**
 * This is a workaround. For some reason, apollo query won't return local field from regionsListQuery
 * @param regionId
 * @returns
 */
export function useOfflineDate(regionId: string): string | undefined {
  const client = useApolloClient();

  const data = client.readFragment({
    fragment: RegionOfflineDateFragmentDoc,
    id: `Region:${regionId}`,
  });

  return data?.offlineDate;
}
