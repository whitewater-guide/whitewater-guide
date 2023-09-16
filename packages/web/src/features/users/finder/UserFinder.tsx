import type { NamedNode } from '@whitewater-guide/schema';
import get from 'lodash/get';
import React from 'react';

import type { AutocompleteProps } from '../../../components/autocomplete';
import { QueryAutocomplete } from '../../../components/autocomplete';
import type {
  FindUsersQueryResult,
  FindUsersQueryVariables,
} from './findUsers.generated';
import { FindUsersDocument } from './findUsers.generated';

interface Props extends Omit<AutocompleteProps, 'options'> {
  editorsOnly?: boolean;
}

export class UserFinder extends React.PureComponent<Props> {
  getVariables = (input: string | null): FindUsersQueryVariables => ({
    filter: {
      searchString: input || '',
      editorsOnly: this.props.editorsOnly,
    },
  });

  getNodes = (result?: FindUsersQueryResult): NamedNode[] =>
    get(result, 'data.users', []);

  render() {
    const { editorsOnly, ...props } = this.props;
    const placeholder = editorsOnly ? 'Select editor' : 'Select user';
    return (
      <QueryAutocomplete
        {...props}
        placeholder={placeholder}
        query={FindUsersDocument}
        getVariables={this.getVariables}
        getNodes={this.getNodes}
      />
    );
  }
}
