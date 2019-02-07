import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { NamedNodeFinder } from '../../../components/named-node-finder';
import { FIND_USERS_QUERY, QResult, QVars } from './findUsers.query';

interface Props {
  user: NamedNode | null;
  onChange: (user: NamedNode | null) => void;
  editorsOnly?: boolean;
  // Set to undefined if selection is required
  clearSelectionTitle?: string;
}

export class UserFinder extends React.PureComponent<Props> {
  getVariables = (input: string | null): QVars => ({
    filter: {
      search: input || '',
      editorsOnly: this.props.editorsOnly,
    },
  });

  getNodes = (result?: QResult): NamedNode[] => {
    if (!result) {
      return [];
    }
    return result.users;
  };

  render() {
    const { user, onChange, editorsOnly } = this.props;
    const hintText = editorsOnly ? 'Select editor' : 'Select user';
    return (
      <NamedNodeFinder<QResult, QVars>
        clearSelectionTitle="Clean selection"
        value={user}
        onChange={onChange}
        query={FIND_USERS_QUERY}
        getVariables={this.getVariables}
        getNodes={this.getNodes}
        hintText={hintText}
      />
    );
  }
}
