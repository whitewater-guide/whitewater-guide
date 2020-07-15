import {
  LogbookDescentsConnection,
  LogbookSectionAll,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';

const MY_RECENT_SECTIONS = gql`
  query myRecentSections {
    myLogbookDescents {
      edges {
        node {
          id
          section {
            ...logbookSectionAll
          }
        }
      }
    }
  }
  ${LogbookSectionAll}
`;

interface QResult {
  myLogbookDescents: LogbookDescentsConnection;
}

const useRecentSections = (skip?: boolean) => {
  const query = useQuery<QResult>(MY_RECENT_SECTIONS, {
    fetchPolicy: 'cache-first',
    skip,
  });
  const { data } = query;
  const sections = useMemo(
    () => data?.myLogbookDescents.edges.map((e) => e.node.section) || [],
    [data],
  );
  return { ...query, sections };
};

export default useRecentSections;
