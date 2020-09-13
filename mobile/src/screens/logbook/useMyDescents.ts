import {
  Descent,
  DescentsFilter,
  Page,
  RelayConnection,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';

const LIST_MY_DESCENTS = gql`
  query listMyDescents($filter: DescentsFilter, $page: Page) {
    myDescents(filter: $filter, page: $page)
    @connection(key: "myDescents", filter: ["filter"]) {
      edges {
        node {
          id

          startedAt
          duration
          level {
            value
            unit
          }
          comment
          public

          section {
            id
            name
            river {
              id
              name
            }
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
`;

interface QVars {
  filter?: DescentsFilter;
  page?: Page;
}

interface QResult {
  myDescents: RelayConnection<Descent>;
}

const useMyDescents = () => {
  const query = useQuery<QResult, QVars>(LIST_MY_DESCENTS, {
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
              after: data?.myDescents.pageInfo.endCursor,
            },
          },
          updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
            const newEdges = fetchMoreResult.myDescents.edges;
            const pageInfo = fetchMoreResult.myDescents.pageInfo;

            return newEdges.length
              ? {
                  myDescents: {
                    __typename: previousResult.myDescents.__typename,
                    edges: [...previousResult.myDescents.edges, ...newEdges],
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
};

export default useMyDescents;
