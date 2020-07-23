import {
  Connection,
  Descent,
  RelayConnection,
  Section,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';

const fragment = gql`
  fragment descentSearchSection on Section {
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
`;

const SEARCH_SECTIONS = gql`
  query searchSections($search: String) {
    sections(filter: { search: $search }, page: { limit: 20 }) {
      nodes {
        ...descentSearchSection
      }
    }

    myDescents(page: { limit: 20 }) {
      edges {
        node {
          id

          section {
            ...descentSearchSection
          }
        }
      }
    }
  }
  ${fragment}
`;

interface QVars {
  search: string;
}

interface QResult {
  sections: Connection<Section>;
  myDescents: RelayConnection<Descent>;
}

export const useSearchSections = (search: string) => {
  const query = useQuery<QResult, QVars>(SEARCH_SECTIONS, {
    fetchPolicy: 'no-cache',
    skip: !search,
    variables: { search },
  });
  const { data, loading } = query;

  const result = useMemo(
    () => [
      {
        id: 'Recent',
        data: data?.myDescents.edges.map((e) => e.node.section) || [],
      },
      { id: 'Search', data: data?.sections.nodes || [] },
    ],
    [data],
  );
  return { loading, result };
};

export type SearchResults = ReturnType<typeof useSearchSections>;
