import { TableRow, TableRowColumn } from 'material-ui/Table';
import React from 'react';
import { MutationFn } from 'react-apollo';
import { DeleteButton } from '../../../../components';
import { User } from '@whitewater-guide/commons';

interface Props {
  user: User;
  regionId: string;
  removeEditor: MutationFn<any, { userId: string; regionId: string }>;
}

class EditorListItem extends React.PureComponent<Props> {
  removeEditor = (userId: string) => {
    const { regionId, removeEditor } = this.props;
    removeEditor({ variables: { userId, regionId } });
  };

  render() {
    const {
      user: { id, name },
    } = this.props;
    return (
      <TableRow>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>
          <DeleteButton id={id} deleteHandler={this.removeEditor} />
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default EditorListItem;
