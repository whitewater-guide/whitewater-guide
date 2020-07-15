import gql from 'graphql-tag';
import {
  LogbookDescentAll,
  LogbookDescentsConnection,
  QueryMyLogbookDescentsArgs,
} from '@whitewater-guide/logbook-schema';
import { useQuery } from 'react-apollo';
import { useMemo } from 'react';

const LIST_MY_DESCENTS = gql`
  query listMyLogbookDescents($filter: LogbookDescentsFilter, $page: Page) {
    myLogbookDescents(filter: $filter, page: $page) {
      edges {
        node {
          ...logbookDescentAll
        }
        cursor
      }
      pageInfo {
        endCursor
        hasMore
      }
    }
  }
  ${LogbookDescentAll}
`;

interface QResult {
  myLogbookDescents: LogbookDescentsConnection;
}

const useMyDescents = () => {
  const query = useQuery<QResult, QueryMyLogbookDescentsArgs>(LIST_MY_DESCENTS);
  const { data } = query;
  const descents = useMemo(
    () => data?.myLogbookDescents.edges.map((e) => e.node) || [],
    [data],
  );
  return { ...query, descents };
};

export default useMyDescents;
