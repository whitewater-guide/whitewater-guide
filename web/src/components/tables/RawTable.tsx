import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Column, Table as RVTable, TableProps } from 'react-virtualized';
import { compose, mapProps } from 'recompose';
import { withMe } from '../../ww-clients/features/users/withMe';
import { AdminColumn } from './AdminColumn';
import { BooleanColumn, renderBoolean } from './BooleanColumn';

const columnMapper = (isAdmin: boolean) => (column: React.ReactElement<TableProps>) => {
  if (column.type === AdminColumn as React.ComponentClass<any>) {
    return isAdmin ? React.createElement(Column as React.ComponentClass<any>, column.props) : null;
  } else if (column.type === BooleanColumn as React.ComponentClass<any>) {
    const { iconFalse, iconTrue, ...props } = column.props;
    return React.createElement(Column as React.ComponentClass<any>, {
      ...props,
      cellRenderer: renderBoolean(iconTrue, iconFalse),
    });
  }
  return column;
};

const enhancer = compose<{}, TableProps>(
  withMe(),
  mapProps(({ isAdmin, me, meLoading, children, ...props }) => ({
    children: React.Children.map(children, columnMapper(isAdmin)),
    ...props,
  })),
);

export const RawTable: React.ComponentClass<TableProps> = enhancer(RVTable);
RVTable.propTypes = { ...RVTable.propTypes, children: PropTypes.any };
RawTable.propTypes = RVTable.propTypes as any;
RawTable.defaultProps = RVTable.defaultProps as any;
