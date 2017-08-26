import * as React from 'react';
import { Column, Index, TableProps } from 'react-virtualized';
import { AdminColumn, Table } from '../../../components';
import { Region } from '../../../ww-commons/features/regions';

export type RegionsTableProps = Partial<TableProps> & {
  regions: Region[];
  onRegionClick: (id: string) => void;
};

class RegionsTable extends React.PureComponent<RegionsTableProps> {

  rowGetter = ({ index }: Index) => this.props.regions[index];

  onRowClick = ({ index }: Index) => this.props.onRegionClick(this.props.regions[index].id);

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
        <Column width={200} label="Name" dataKey="name"/>
        <Column width={100} label="Rivers" dataKey="riversCount"/>
        <Column width={100} label="Sections" dataKey="sectionsCount"/>
        <AdminColumn width={100} label="Hidden" dataKey="hidden"/>
      </Table>
    );
  }

}

export default RegionsTable;
