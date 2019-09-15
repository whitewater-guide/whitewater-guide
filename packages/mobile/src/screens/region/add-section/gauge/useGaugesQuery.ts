import { useRegion } from '@whitewater-guide/clients';
import { GaugesFilter, NamedNode, Page } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useState } from 'react';
import { useQuery } from 'react-apollo';
import { useDebounce } from 'use-debounce';
import { ListedGauge } from './types';

const FIND_GAUGES_QUERY = gql`
  query findGauges($filter: GaugesFilter, $page: Page) {
    gauges(filter: $filter, page: $page) {
      nodes {
        id
        name
        code
        flowUnit
        levelUnit
        lastMeasurement {
          flow
          level
          timestamp
        }
      }
    }
  }
`;

interface QVars {
  filter?: GaugesFilter;
  page?: Page;
}

interface QResult {
  gauges: {
    nodes: ListedGauge[];
  };
}

type Result = [string, (txt: string) => void, boolean, ListedGauge[]];

const useGaugesQuery = (initialInput = ''): Result => {
  const { node } = useRegion();
  const [input, setInput] = useState(initialInput);
  const [search] = useDebounce(input, 200);

  const { loading, data } = useQuery<QResult, QVars>(FIND_GAUGES_QUERY, {
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
    data && data.gauges && data.gauges.nodes ? data.gauges.nodes : [],
  ];
};

export default useGaugesQuery;