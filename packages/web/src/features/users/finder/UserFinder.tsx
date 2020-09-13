import { NamedNode } from '@whitewater-guide/commons';
import get from 'lodash/get';
import React from 'react';
import { QueryResult } from 'react-apollo';

import {
  AutocompleteProps,
  QueryAutocomplete,
} from '../../../components/autocomplete';
import { FIND_USERS_QUERY, QResult, QVars } from './findUsers.query';

interface Props extends Omit<AutocompleteProps, 'options'> {
  editorsOnly?: boolean;
}

export class UserFinder extends React.PureComponent<Props> {
  getVariables = (input: string | null): QVars => ({
    filter: {
      searchString: input || '',
      editorsOnly: this.props.editorsOnly,
    },
  });

  getNodes = (result?: QueryResult<QResult>): NamedNode[] => {
    return get(result, 'data.users', []);
  };

  render() {
    const { editorsOnly, ...props } = this.props;
    const placeholder = editorsOnly ? 'Select editor' : 'Select user';
    return (
      <QueryAutocomplete
        {...props}
        placeholder={placeholder}
        query={FIND_USERS_QUERY}
        getVariables={this.getVariables}
        getNodes={this.getNodes}
      />
    );
  }
}
