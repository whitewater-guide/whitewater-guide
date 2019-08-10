import React from 'react';
import {
  defaultTableCellRenderer,
  TableCellProps,
  TableCellRenderer,
} from 'react-virtualized';
import { MUICell } from './MUICell';

export const renderMUICell = (
  cellRenderer: TableCellRenderer = defaultTableCellRenderer,
): TableCellRenderer => (props: TableCellProps) => {
  return <MUICell>{cellRenderer(props)}</MUICell>;
};
