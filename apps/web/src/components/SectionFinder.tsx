import type { QueryResult } from '@apollo/client';
import type {
  NamedNode,
  SectionNameShortFragment,
} from '@whitewater-guide/schema';
import get from 'lodash/get';
import React, { useCallback } from 'react';

import type { AutocompleteProps } from './autocomplete';
import { QueryAutocomplete } from './autocomplete';
import { FindSectionsDocument } from './findSections.generated';

const optionToString = (option: SectionNameShortFragment) => (
  <span>
    <strong>{option.river.name}</strong> - {option.name}
  </span>
);

type Props = Omit<AutocompleteProps, 'options'> & {
  regionId?: string;
  riverId?: string;
  limit?: number;
};

export const SectionFinder = React.memo((props: Props) => {
  const { regionId, riverId, limit = 5 } = props;

  const getVariables = useCallback(
    (input: string | null) => ({
      filter: {
        search: input || '',
        regionId,
        riverId,
      },
      page: { limit },
    }),
    [regionId, riverId, limit],
  );

  const getNodes = useCallback(
    (result?: QueryResult): NamedNode[] =>
      get(result, 'data.sections.nodes', []),
    [],
  );

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select section"
      query={FindSectionsDocument}
      getVariables={getVariables}
      getNodes={getNodes}
      optionToString={optionToString}
    />
  );
});

SectionFinder.displayName = 'SectionFinder';
