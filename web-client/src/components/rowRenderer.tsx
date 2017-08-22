import * as Radium from 'radium';
import * as React from 'react';
import { TableRowProps } from 'react-virtualized';
import { Styles } from '../styles/types';

const RadiumDiv = Radium(({ children, ...props }) => (<div {...props}>{children}</div>));

interface Props extends TableRowProps {
  key?: string;
}

type RowMouseEvent = React.SyntheticEvent<React.MouseEvent<any>>;

export function rowRenderer(props: Props) {
  const {
    className,
    columns,
    index,
    key,
    onRowClick,
    onRowDoubleClick,
    onRowMouseOver,
    onRowMouseOut,
    rowData,
    style,
  } = props;
  const a11yProps: any = {};

  if (onRowClick || onRowDoubleClick || onRowMouseOver || onRowMouseOut) {
    a11yProps['aria-label'] = 'row';
    a11yProps.role = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = (event: RowMouseEvent) => onRowClick({ index, rowData, event });
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (event: RowMouseEvent) => onRowDoubleClick({ index, rowData, event });
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (event: RowMouseEvent) => onRowMouseOut({ index, rowData, event });
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (event: RowMouseEvent) => onRowMouseOver({ index, rowData, event });
    }
  }

  const divStyle = [style, styles.row, (index % 2) ?  styles.oddRow : styles.evenRow];

  return (
    <RadiumDiv
      {...a11yProps}
      className={className}
      key={key}
      style={divStyle}
    >
      {columns}
    </RadiumDiv>
  );
}

const styles: Styles  = {
  row: {
    cursor: 'default',
    ':hover': {
      backgroundColor: '#CCCCCC',
    },
  },
  evenRow: {
    backgroundColor: '#EEEEEE',
  },
  oddRow: {
    backgroundColor: '#FFFFFF',
  },
};
