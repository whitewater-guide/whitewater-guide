import React from 'react';
import {
  defaultTableHeaderRenderer,
  TableHeaderProps,
  TableHeaderRenderer,
} from 'react-virtualized';
import { MUICell } from './MUICell';

export const renderMUIHeaderCell = (
  cellRenderer: TableHeaderRenderer = defaultTableHeaderRenderer,
): TableHeaderRenderer => (props: TableHeaderProps) => {
  return <MUICell variant="head">{cellRenderer(props)}</MUICell>;
};
