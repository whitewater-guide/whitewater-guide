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
    myDescents(filter: $filter, page: $page) {
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

          createdAt
          updatedAt

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
  const query = useQuery<QResult, QVars>(LIST_MY_DESCENTS);
  const { data } = query;
  const descents = useMemo(
    () => data?.myDescents.edges.map((e) => e.node) || [],
    [data],
  );
  return { ...query, descents };
};

export default useMyDescents;
