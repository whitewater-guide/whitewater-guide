import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Column, Index, TableCellProps, TableProps } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { AdminColumn, DeleteButton, Table } from '../../../components';
import { Source } from '../../../ww-commons/features/sources';

export type SourcesTableProps = WithDeleteMutation<'removeSource'> & Partial<TableProps> & {
  sources: Source[];
  onSourceClick: (id: string) => void;
};

class SourcesTable extends React.PureComponent<SourcesTableProps> {

  rowGetter = ({ index }: Index) => this.props.sources[index];

  onRowClick = ({ index }: Index) => this.props.onSourceClick(this.props.sources[index].id);

  renderEnabled = (props: TableCellProps) => (
    <FontIcon className="material-icons">{props.cellData ? 'checkmark' : 'remove'}</FontIcon>
  );

  renderAdminActions = (props: TableCellProps) => (
    <span>
      <Link to={`/sources/${props.rowData.id}/settings`}>
        <FontIcon className="material-icons">mode_edit</FontIcon>
      </Link>
      <DeleteButton id={props.rowData.id} deleteHandler={this.props.removeSource} />
    </span>
  );

  render() {
    const { sources, ...props } = this.props;
    return (
      <Table
        {...props as any}
        headerHeight={52}
        rowHeight={48}
        rowCount={sources.length}
        rowGetter={this.rowGetter}
        onRowClick={this.onRowClick}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Rivers" dataKey="harvestMode" />
        <Column width={50} label="Visible" dataKey="enabled" cellRenderer={this.renderEnabled} />
        <AdminColumn width={100} label="Actions" dataKey="actions" cellRenderer={this.renderAdminActions} />
      </Table>
    );
  }

}

export default SourcesTable;
