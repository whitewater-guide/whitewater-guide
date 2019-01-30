import React from 'react';
import { Index, TableProps as VTableProps } from 'react-virtualized';
import { NamedNode } from '@whitewater-guide/commons';
import { RawTable } from './RawTable';

export type TableProps<TResource extends NamedNode> = Partial<VTableProps> & {
  list: TResource[];
  onResourceClick?: (id: string) => void;
};

export class Table<
  DeleteHandle extends string,
  TResource extends NamedNode
> extends React.PureComponent<TableProps<TResource>> {
  rowGetter = ({ index }: Index) => this.props.list[index];

  onRowClick = ({ index }: Index) => {
    const { onResourceClick, list } = this.props;
    if (onResourceClick) {
      onResourceClick(list[index].id);
    }
  };

  render() {
    const { list, children, rowHeight = 48, ...props } = this.props;
    return (
      <RawTable
        {...props as any}
        headerHeight={52}
        rowHeight={rowHeight}
        rowCount={list.length}
        rowGetter={this.rowGetter}
        onRowClick={this.onRowClick}
      >
        {children}
      </RawTable>
    );
  }
}
