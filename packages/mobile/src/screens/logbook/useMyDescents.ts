import { useMemo } from 'react';

import { useListMyDescentsQuery } from './myDescents.generated';

export default function useMyDescents() {
  const query = useListMyDescentsQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const { data, fetchMore, ...rest } = query;
  const props = useMemo(
    () => ({
      descents: data?.myDescents?.edges?.map((e) => e.node),
      loadMore: () => {
        if (!data?.myDescents?.pageInfo.hasMore) {
          return;
        }
        return fetchMore({
          variables: {
            page: {
              after: data?.myDescents?.pageInfo.endCursor,
            },
          },
        });
      },
    }),
    [data, fetchMore],
  );
  return { ...rest, ...props };
}
