import { useRegion } from '@whitewater-guide/clients';
import { NamedNode, Page, RiversFilter } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useDebounce } from 'use-debounce';

const FIND_RIVERS_QUERY = gql`
  query findRivers($filter: RiversFilter, $page: Page) {
    rivers(filter: $filter, page: $page) {
      nodes {
        id
        name
      }
    }
  }
`;

interface QVars {
  filter?: RiversFilter;
  page?: Page;
}

interface QResult {
  rivers: {
    nodes: NamedNode[];
  };
}

type Result = [string, (txt: string) => void, boolean, NamedNode[]];

const useRiversQuery = (initialInput = ''): Result => {
  const { node } = useRegion();
  const [input, setInput] = useState(initialInput);
  const [search] = useDebounce(input, 200);

  const { loading, data } = useQuery<QResult, QVars>(FIND_RIVERS_QUERY, {
    variables: {
      filter: {
        search,
        regionId: node ? node.id : undefined,
      },
      page: { limit: 20 },
    },
    fetchPolicy: 'no-cache',
    skip: search === '',
  });

  return [
    input,
    setInput,
    loading,
    data && data.rivers && data.rivers.nodes ? data.rivers.nodes : [],
  ];
};

export default useRiversQuery;
