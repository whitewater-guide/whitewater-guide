import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import { ColumnProps, TableCellProps } from 'react-virtualized';

interface BooleanColumnProps extends ColumnProps {
  iconTrue?: string;
  iconFalse?: string;
}

export class BooleanColumn extends React.Component<BooleanColumnProps> {
}

export const renderBoolean = (iconTrue: string, iconFalse: string) => (props: TableCellProps) => {
  return (
    <FontIcon className="material-icons">
      {props.cellData ? iconTrue : iconFalse}
    </FontIcon>
  );
};
