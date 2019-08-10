import { NamedNode } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import get from 'lodash/get';
import React, { useCallback } from 'react';
import { QueryResult } from 'react-apollo';
import { AutocompleteProps, QueryAutocomplete } from './autocomplete';

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

type Props = Omit<AutocompleteProps, 'options'> & {
  regionId: string;
  limit?: number;
};

export const RiverFinder: React.FC<Props> = React.memo((props) => {
  const { regionId, limit = 5 } = props;

  const getVariables = useCallback(
    (input: string | null) => ({
      filter: {
        search: input || '',
        regionId,
      },
      page: { limit },
    }),
    [regionId, limit],
  );

  const getNodes = useCallback((result?: QueryResult): NamedNode[] => {
    return get(result, 'data.rivers.nodes', []);
  }, []);

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select river"
      query={FIND_RIVERS_QUERY}
      getVariables={getVariables}
      getNodes={getNodes}
    />
  );
});

RiverFinder.displayName = 'RiverFinder';
