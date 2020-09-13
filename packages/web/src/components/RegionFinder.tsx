import { NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import get from 'lodash/get';
import React, { useCallback } from 'react';
import { QueryResult } from 'react-apollo';

import { AutocompleteProps, QueryAutocomplete } from './autocomplete';

const FIND_REGIONS_QUERY = gql`
  query findRegions($filter: RegionFilterOptions, $page: Page) {
    regions(filter: $filter, page: $page) {
      nodes {
        id
        name
      }
    }
  }
`;

type Props = Omit<AutocompleteProps, 'options'>;

export const RegionFinder: React.FC<Props> = React.memo((props) => {
  const getVariables = useCallback(
    (input: string | null) => ({
      filter: {
        searchString: input || '',
      },
      page: { limit: 5 },
    }),
    [],
  );

  const getNodes = useCallback((result?: QueryResult): NamedNode[] => {
    return get(result, 'data.regions.nodes', []);
  }, []);

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select region"
      query={FIND_REGIONS_QUERY}
      getVariables={getVariables}
      getNodes={getNodes}
    />
  );
});

RegionFinder.displayName = 'RegionFinder';
