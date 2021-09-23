import { QueryResult } from '@apollo/client';
import { NamedNode } from '@whitewater-guide/schema';
import get from 'lodash/get';
import React, { useCallback } from 'react';

import { AutocompleteProps, QueryAutocomplete } from './autocomplete';
import { FindRiversDocument } from './findRivers.generated';

type Props = Omit<AutocompleteProps, 'options'> & {
  regionId: string;
  limit?: number;
};

export const RiverFinder = React.memo<Props>((props) => {
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

  const getNodes = useCallback(
    (result?: QueryResult): NamedNode[] => get(result, 'data.rivers.nodes', []),
    [],
  );

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select river"
      query={FindRiversDocument}
      getVariables={getVariables}
      getNodes={getNodes}
    />
  );
});

RiverFinder.displayName = 'RiverFinder';
