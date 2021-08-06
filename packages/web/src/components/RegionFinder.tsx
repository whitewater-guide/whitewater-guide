import { NamedNode } from '@whitewater-guide/schema';
import get from 'lodash/get';
import React, { useCallback } from 'react';
import { QueryResult } from 'react-apollo';

import { AutocompleteProps, QueryAutocomplete } from './autocomplete';
import { FindRegionsDocument } from './findRegions.generated';

type Props = Omit<AutocompleteProps, 'options'>;

export const RegionFinder = React.memo<Props>((props) => {
  const getVariables = useCallback(
    (input: string | null) => ({
      filter: {
        searchString: input || '',
      },
      page: { limit: 5 },
    }),
    [],
  );

  const getNodes = useCallback(
    (result?: QueryResult): NamedNode[] =>
      get(result, 'data.regions.nodes', []),
    [],
  );

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select region"
      query={FindRegionsDocument}
      getVariables={getVariables}
      getNodes={getNodes}
    />
  );
});

RegionFinder.displayName = 'RegionFinder';
