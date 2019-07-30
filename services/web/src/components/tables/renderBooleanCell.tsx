import Icon from '@material-ui/core/Icon';
import React from 'react';
import { TableCellProps } from 'react-virtualized';
import { MUICell } from './MUICell';

export const renderBooleanCell = (iconTrue?: string, iconFalse?: string) => (
  props: TableCellProps,
) => {
  return (
    <MUICell>
      <Icon>{props.cellData ? iconTrue : iconFalse}</Icon>
    </MUICell>
  );
};
