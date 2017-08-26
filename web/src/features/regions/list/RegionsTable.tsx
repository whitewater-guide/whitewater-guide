import * as React from 'react';
import { Column, Index, Table, TableProps } from 'react-virtualized';
import { Region } from '../../../ww-commons/features/regions';

// export type RegionsTableProps = Omit<TableProps, 'headerHeight' | 'rowHeight' | 'rowCount'> & {
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
        headerHeight={20}
        rowHeight={30}
        rowCount={regions.length}
        rowGetter={this.rowGetter}
        onRowClick={this.onRowClick}
      >
        <Column width={100} label="Name" dataKey="name"/>
        <Column width={100} label="hidden" dataKey="hidden"/>
      </Table>
    );
  }

}

export default RegionsTable;
