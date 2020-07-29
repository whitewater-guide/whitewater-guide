import {
  Connection,
  Descent,
  RelayConnection,
  Section,
} from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import uniqBy from 'lodash/uniqBy';
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
  query searchSections($search: String, $skipRecent: Boolean!) {
    sections(filter: { search: $search }, page: { limit: 20 }) {
      nodes {
        ...descentSearchSection
      }
    }

    myDescents(page: { limit: 20 }) @skip(if: $skipRecent) {
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
  skipRecent: boolean;
}

interface QResult {
  sections: Connection<Section>;
  myDescents?: RelayConnection<Descent>;
}

export function useSearchSections(search: string, mandatory?: Section) {
  const query = useQuery<QResult, QVars>(SEARCH_SECTIONS, {
    fetchPolicy: 'no-cache',
    variables: { search, skipRecent: !!search },
  });
  const { data, loading } = query;

  const result = useMemo(() => {
    const recent = uniqBy(
      data?.myDescents?.edges.map((e) => e.node.section) || [],
      'id',
    );
    const found = search ? data?.sections.nodes || [] : [];
    if (mandatory && !found.some((s) => s.id === mandatory.id)) {
      found.unshift(mandatory);
    }
    const all = [];
    if (recent.length) {
      all.push({ id: 'Recent', data: recent });
    }
    if (search) {
      all.push({ id: 'Search', data: found });
    }
    return all;
  }, [data, search, mandatory]);
  return { loading, result };
}

export type SearchResults = ReturnType<typeof useSearchSections>;
