import Icon from '@material-ui/core/Icon';
import React from 'react';
import { MUICell } from './MUICell';
import { isEmptyRow, TableCellProps } from './types';

export const renderBooleanCell = (iconTrue?: string, iconFalse?: string) => (
  props: TableCellProps<any, boolean>,
) => {
  if (isEmptyRow(props.rowData)) {
    return <MUICell />;
  }
  return (
    <MUICell>
      <Icon>{props.cellData ? iconTrue : iconFalse}</Icon>
    </MUICell>
  );
};
