import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { TableProps } from 'react-virtualized';

import {
  Column,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components';
import { UsersTableUserFragment } from './usersTable.generated';
import UserTableActions from './UserTableActions';

const styles = createStyles({
  input: {
    width: '100%',
  },
});

interface OwnProps {
  users: UsersTableUserFragment[];
  onRemove?: (id: string) => void;
}

type TCR = TableCellRenderer<UsersTableUserFragment>;

type Props = OwnProps &
  WithStyles<typeof styles> &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

class UsersTable extends React.PureComponent<Props> {
  renderActions: TCR = ({ rowData }) => {
    if (isEmptyRow(rowData)) {
      return null;
    }
    return <UserTableActions user={rowData} onRemove={this.props.onRemove} />;
  };

  render(): React.ReactNode {
    const { users, registerChild, onRowsRendered } = this.props;
    return (
      <Table ref={registerChild} data={users} onRowsRendered={onRowsRendered}>
        <Column width={300} label="ID" dataKey="id" />
        <Column width={300} label="Name" dataKey="name" />
        <Column width={300} label="Email" dataKey="email" flexGrow={1} />
        <Column
          width={100}
          label="Actions"
          dataKey="actions"
          cellRenderer={this.renderActions}
        />
      </Table>
    );
  }
}

export default withStyles(styles)(UsersTable);
