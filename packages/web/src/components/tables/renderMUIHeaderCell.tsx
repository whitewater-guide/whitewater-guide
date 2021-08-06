import React from 'react';
import {
  defaultTableHeaderRenderer,
  TableHeaderProps,
  TableHeaderRenderer,
} from 'react-virtualized';

import { MUICell } from './MUICell';

export const renderMUIHeaderCell =
  (
    cellRenderer: TableHeaderRenderer = defaultTableHeaderRenderer,
    // eslint-disable-next-line react/display-name
  ): TableHeaderRenderer =>
  (props: TableHeaderProps) =>
    <MUICell variant="head">{cellRenderer(props)}</MUICell>;
