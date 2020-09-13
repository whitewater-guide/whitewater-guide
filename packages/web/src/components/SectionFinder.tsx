import { NamedNode, Section } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import get from 'lodash/get';
import React, { useCallback } from 'react';
import { QueryResult } from 'react-apollo';

import { AutocompleteProps, QueryAutocomplete } from './autocomplete';

const FIND_SECTIONS_QUERY = gql`
  query findSections($filter: SectionsFilter, $page: Page) {
    sections(filter: $filter, page: $page) {
      nodes {
        id
        name
        river {
          id
          name
        }
      }
    }
  }
`;

const optionToString: any = (option: Section) => (
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

  const getNodes = useCallback((result?: QueryResult): NamedNode[] => {
    return get(result, 'data.sections.nodes', []);
  }, []);

  return (
    <QueryAutocomplete
      {...props}
      placeholder="Select section"
      query={FIND_SECTIONS_QUERY}
      getVariables={getVariables}
      getNodes={getNodes}
      optionToString={optionToString}
    />
  );
});

SectionFinder.displayName = 'SectionFinder';
