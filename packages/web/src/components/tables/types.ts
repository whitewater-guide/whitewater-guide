import React from 'react';
import { TableCellProps as TCP } from 'react-virtualized';

export interface EmptyRow {
  __emptyRow: true;
}

export const isEmptyRow = (v: any): v is EmptyRow =>
  typeof v === 'object' && v.__emptyRow === true;

export const EMPTY_ROW: EmptyRow = {
  __emptyRow: true,
};

/**
 * React-virtualized types are not generic, this is a replacement
 */
export interface TableCellProps<R, C> extends TCP {
  cellData?: C;
  rowData: R | EmptyRow; // EmptyRow is returned when the row hasn't loaded yet
}

export type TableCellRenderer<R, C = any> = (
  props: TableCellProps<R, C>,
) => React.ReactNode;
