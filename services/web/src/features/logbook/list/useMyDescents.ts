import gql from 'graphql-tag';
import {
  LogbookDescentAll,
  LogbookDescentsConnection,
  QueryMyLogbookDescentsArgs,
} from '@whitewater-guide/logbook-schema';
import { useQuery } from 'react-apollo';

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

const useMyDescents = () =>
  useQuery<QResult, QueryMyLogbookDescentsArgs>(LIST_MY_DESCENTS);

export default useMyDescents;
