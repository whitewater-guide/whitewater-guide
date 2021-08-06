import React from 'react';
import {
  defaultTableCellRenderer,
  TableCellProps,
  TableCellRenderer,
} from 'react-virtualized';

import { MUICell } from './MUICell';

export const renderMUICell =
  (
    cellRenderer: TableCellRenderer = defaultTableCellRenderer,
    // eslint-disable-next-line react/display-name
  ): TableCellRenderer =>
  (props: TableCellProps) =>
    <MUICell>{cellRenderer(props)}</MUICell>;
