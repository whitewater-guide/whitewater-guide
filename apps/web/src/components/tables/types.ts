import type { FC } from 'react';
import type React from 'react';
import type {
  AutoSizerProps,
  InfiniteLoaderProps,
  TableCellProps as TCP,
  TableProps,
} from 'react-virtualized';
import {
  AutoSizer as ASizer,
  InfiniteLoader as IL,
  Table,
} from 'react-virtualized';

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

export const InfiniteLoader = IL as unknown as FC<InfiniteLoaderProps>;
export const AutoSizer = ASizer as unknown as FC<AutoSizerProps>;
export const VirtualizedTable = Table as unknown as FC<TableProps>;
