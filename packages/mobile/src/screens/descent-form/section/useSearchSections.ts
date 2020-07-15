import { Connection, Section } from '@whitewater-guide/commons';
import {
  LogbookSectionAll,
  LogbookSectionsConnection,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';

const SEARCH_SECTIONS = gql`
  query searchSections($search: String) {
    logbook: myLogbookSections(filter: { name: $search }) {
      edges {
        node {
          ...logbookSectionAll
        }
      }
    }

    db: sections(filter: { search: $search }) {
      nodes {
        id
        name
        difficulty
        river {
          id
          name
        }
        region {
          id
          name
        }
        levels {
          minimum
          maximum
          optimum
          impossible
          approximate
        }
        flows {
          minimum
          maximum
          optimum
          impossible
          approximate
        }
        gauge {
          id
          name
          levelUnit
          flowUnit
        }
        putIn {
          id
          coordinates
        }
        takeOut {
          id
          coordinates
        }
      }
      count
    }
  }
  ${LogbookSectionAll}
`;

interface QVars {
  search: string;
}

interface QResult {
  logbook: LogbookSectionsConnection;
  db: Connection<Section>;
}

const useSearchSections = (search: string) => {
  const query = useQuery<QResult, QVars>(SEARCH_SECTIONS, {
    fetchPolicy: 'no-cache',
    skip: !search,
    variables: { search },
  });
  const { data } = query;

  const result = useMemo(
    () => ({
      logbook: data?.logbook.edges.map((e) => e.node) || [],
      db: data?.db.nodes || [],
    }),
    [data],
  );
  return { ...query, ...result };
};

export default useSearchSections;
