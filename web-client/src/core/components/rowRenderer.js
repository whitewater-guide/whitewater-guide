import React from 'react';
import Radium from 'radium';

const RadiumDiv = Radium(({children, ...props}) => (<div {...props}>{children}</div>));

export function rowRenderer({
                              className,
                              columns,
                              index,
                              isScrolling,
                              key,
                              onRowClick,
                              onRowDoubleClick,
                              onRowMouseOver,
                              onRowMouseOut,
                              rowData,
                              style
                            }) {
  const a11yProps = {};

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOver ||
    onRowMouseOut
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.role = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = () => onRowClick({index, rowData})
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = () => onRowDoubleClick({index, rowData})
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = () => onRowMouseOut({index, rowData})
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = () => onRowMouseOver({index, rowData})
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
  )
}

const styles  = {
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
