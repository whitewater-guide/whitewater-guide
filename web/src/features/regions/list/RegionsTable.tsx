import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { Column, Index, TableCellProps, TableProps } from 'react-virtualized';
import { AdminColumn, Table } from '../../../components';
import { Region } from '../../../ww-commons/features/regions';
import { Link } from 'react-router-dom';

export type RegionsTableProps = Partial<TableProps> & {
  regions: Region[];
  onRegionClick: (id: string) => void;
};

class RegionsTable extends React.PureComponent<RegionsTableProps> {

  rowGetter = ({ index }: Index) => this.props.regions[index];

  onRowClick = ({ index }: Index) => this.props.onRegionClick(this.props.regions[index].id);

  renderVisibility = (props: TableCellProps) => {
    const hidden = props.cellData;
    return hidden ? null : <FontIcon className="material-icons">visibility</FontIcon>;
  };

  renderAdminActions = (props: TableCellProps) => (
    <span>
      <Link to={`/regions/${props.rowData.id}/settings`}>
        <FontIcon className="material-icons">mode_edit</FontIcon>
      </Link>
        <FontIcon className="material-icons">delete_forever</FontIcon>
    </span>
  );

  render() {
    const { regions, ...props } = this.props;
    return (
      <Table
        {...props as any}
        headerHeight={52}
        rowHeight={48}
        rowCount={regions.length}
        rowGetter={this.rowGetter}
        onRowClick={this.onRowClick}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Rivers" dataKey="riversCount" />
        <Column width={100} label="Sections" dataKey="sectionsCount" />
        <AdminColumn width={100} label="Visible" dataKey="hidden" cellRenderer={this.renderVisibility} />
        <AdminColumn width={100} label="Actions" dataKey="actions" cellRenderer={this.renderAdminActions} />
      </Table>
    );
  }

}

export default RegionsTable;
