import { useMemo } from 'react';

import { useListMyDescentsQuery } from './myDescents.generated';

export default function useMyDescents() {
  const query = useListMyDescentsQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const { data, fetchMore, ...rest } = query;
  const props = useMemo(
    () => ({
      descents: data?.myDescents?.edges?.map((e) => e.node) || [],
      loadMore: () =>
        fetchMore({
          variables: {
            page: {
              after: data?.myDescents?.pageInfo.endCursor,
            },
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult?.myDescents?.edges ?? [];
            const { pageInfo } = fetchMoreResult?.myDescents ?? {};

            return newEdges.length
              ? {
                  myDescents: {
                    __typename: previousResult.myDescents?.__typename,
                    edges: [
                      ...(previousResult.myDescents?.edges ?? []),
                      ...newEdges,
                    ],
                    pageInfo,
                  },
                }
              : previousResult;
          },
        }),
    }),
    [data, fetchMore],
  );
  return { ...rest, ...props };
}
