import type { QueryResult, WatchQueryFetchPolicy } from '@apollo/client';
import { useQuery } from '@apollo/client';
import type { NamedNode } from '@whitewater-guide/schema';
import type { DocumentNode } from 'graphql';
import React, { useState } from 'react';

import { Autocomplete } from './Autocomplete';
import itemToString from './itemToString';
import type { AutocompleteFilterOptions, AutocompleteProps } from './types';

const filterOptions: AutocompleteFilterOptions = { matchInput: true };

export interface QueryAutocompleteProps
  extends Omit<AutocompleteProps, 'options'> {
  query: DocumentNode;
  getVariables: (input: string | null) => any;
  getNodes: (result?: QueryResult) => NamedNode[];
  fetchPolicy?: WatchQueryFetchPolicy;
}

export const QueryAutocomplete: React.FC<QueryAutocompleteProps> = (props) => {
  const {
    query,
    getVariables,
    getNodes,
    fetchPolicy = 'no-cache',
    ...rest
  } = props;
  const [inputValue, setInputValue] = useState(itemToString(props.value));
  const result = useQuery(query, {
    variables: getVariables(inputValue),
    fetchPolicy,
  });
  const options = getNodes(result);
  return (
    <Autocomplete
      {...rest}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      options={options}
      filterOptions={filterOptions}
    />
  );
};
