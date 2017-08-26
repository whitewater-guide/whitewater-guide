import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Column, Table as RVTable, TableProps } from 'react-virtualized';
import { compose, hoistStatics, mapProps } from 'recompose';
import { withMe } from '../../ww-clients/features/users/withMe';
import { AdminColumn } from './AdminColumn';

const adminColumnMapper = (column: React.ReactElement<TableProps>) => {
  return column.type === AdminColumn as React.ComponentClass<any> ?
    null :
    React.createElement(Column as React.ComponentClass<any>, column.props);
};

const enhancer = compose<{}, TableProps>(
  withMe(),
  mapProps(({ isAdmin, me, meLoading, children, ...props }) => ({
    children: isAdmin ? children : React.Children.map(children, adminColumnMapper),
    ...props,
  })),
);

export const Table: React.ComponentClass<TableProps> = enhancer(RVTable);
RVTable.propTypes = { ...RVTable.propTypes, children: PropTypes.any } as any;
Table.propTypes = RVTable.propTypes as any;
Table.defaultProps = RVTable.defaultProps as any;
