import { NamedNode } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import React, { useState } from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Autocomplete } from './Autocomplete';
import itemToString from './itemToString';
import { AutocompleteProps } from './types';

export interface QueryAutocompleteProps
  extends Omit<AutocompleteProps, 'options'> {
  query: DocumentNode;
  getVariables: (input: string | null) => any;
  getNodes: (result?: QueryResult) => NamedNode[];
}

export const QueryAutocomplete: React.FC<QueryAutocompleteProps> = (props) => {
  const { query, getVariables, getNodes, ...rest } = props;
  const [inputValue, setInputValue] = useState(itemToString(props.value));
  return (
    <Query query={query} variables={getVariables(inputValue)}>
      {(result: any) => {
        const options = getNodes(result);
        return (
          <Autocomplete
            {...rest}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            options={options}
          />
        );
      }}
    </Query>
  );
};
