import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useAuth, useRegion } from '@whitewater-guide/clients';
import { Node } from '@whitewater-guide/commons';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import {
  AutoSizer,
  Index,
  RowMouseEventHandlerParams,
  Table as VirtualizedTable,
  TableProps,
} from 'react-virtualized';

import columnMapper from './columnMapper';
import { TABLE_HEADER_HEIGHT, TABLE_ROW_HEIGHT } from './constants';
import { EmptyRow } from './types';

const useStyles = makeStyles((theme) =>
  createStyles({
    tableRoot: {
      '& .ReactVirtualized__Table__rowColumn': {
        marginLeft: 0,
        marginRight: 0,
        height: (props: Props) => props.rowHeight,
      },
      '& .ReactVirtualized__Table__headerColumn': {
        marginLeft: 0,
        marginRight: 0,
        height: (props: Props) => props.headerHeight,
      },
      '& *:focus': {
        outline: 'none',
      },
      '& .actions > .MuiTableCell-root': {
        justifyContent: 'flex-end',
        paddingRight: theme.spacing(3),
      },
      '& .centered > .MuiTableCell-root': {
        justifyContent: 'center',
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    tableRow: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      height: (props: Props) => props.rowHeight,
    },
    tableHeaderRow: {
      height: (props: Props) => props.headerHeight,
    },
    tableRowClickable: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[300],
      },
    },
    tableRowEven: {
      backgroundColor: theme.palette.grey[100],
    },
  }),
);

interface Props {
  data?: Node[];
  count?: number;
  onNodeClick?: (id?: string) => void;
  rowHeight?: number;
  headerHeight?: number;
  children?: any;
  onRowsRendered?: TableProps['onRowsRendered'];
  scrollToIndex?: number;
}

export const Table = React.memo(
  React.forwardRef(function (props: Props, ref: React.Ref<VirtualizedTable>) {
    const {
      data = [],
      count,
      onNodeClick,
      rowHeight = TABLE_ROW_HEIGHT,
      headerHeight = TABLE_HEADER_HEIGHT,
      onRowsRendered,
      scrollToIndex,
      children,
    } = props;
    const classes = useStyles({ ...props, rowHeight, headerHeight });
    const { me } = useAuth();
    const region = useRegion();
    const mapColumns = useMemo(() => {
      const isEditor = !!region && !!region.node && region.node.editable;
      const isAdmin = !!me && me.admin;
      return columnMapper(isAdmin, isEditor);
    }, [region, me]);

    const rowGetter = useCallback(
      ({ index }: Index) => data[index] || EmptyRow,
      [data],
    );
    const getRowClassName = useCallback(
      ({ index }: Index) =>
        clsx(
          classes.tableRow,
          { [classes.tableRowClickable]: !!onNodeClick },
          { [classes.tableRowHover]: index !== -1 },
          { [classes.tableRowEven]: index % 2 === 0 },
        ),
      [classes],
    );
    const onRowClick = useCallback(
      ({ index, event }: RowMouseEventHandlerParams) => {
        // prevent events frombbling through portals
        // https://github.com/mui-org/material-ui/issues/15705#issuecomment-492713374
        if (onNodeClick && event.currentTarget.contains(event.target)) {
          onNodeClick(data[index].id);
        }
      },
      [data, onNodeClick],
    );

    return (
      <AutoSizer rowCount={data.length}>
        {({ width, height }) => (
          <VirtualizedTable
            ref={ref}
            width={width}
            height={height}
            className={classes.tableRoot}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            rowCount={count || data.length}
            rowGetter={rowGetter}
            rowClassName={getRowClassName}
            onRowClick={onRowClick}
            onRowsRendered={onRowsRendered}
            scrollToIndex={scrollToIndex}
          >
            {React.Children.map(children, mapColumns)}
          </VirtualizedTable>
        )}
      </AutoSizer>
    );
  }),
);

Table.displayName = 'Table';
