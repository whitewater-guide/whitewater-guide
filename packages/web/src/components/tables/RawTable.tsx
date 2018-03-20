import PropTypes from 'prop-types';
import React from 'react';
import { Column, Table as RVTable, TableProps } from 'react-virtualized';
import { compose, mapProps } from 'recompose';
import { emitter, POKE_TABLES } from '../../utils';
import { withMe } from '../../ww-clients/features/users';
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

class PubSubTable extends React.PureComponent<TableProps> {
  table: RVTable | null = null;

  componentDidMount() {
    // There is always one table rendered in UI, so one event is enough
    emitter.on(POKE_TABLES, this.pokeTable);
  }

  componentWillUnmount() {
    emitter.off(POKE_TABLES, this.pokeTable);
  }

  setRef = (ref: RVTable | null) => {
    this.table = ref;
  };

  pokeTable = () => {
    if (this.table) {
      this.table.forceUpdateGrid();
    }
  };

  render() {
    return (
      <RVTable {...this.props} ref={this.setRef} />
    );
  }
}

export const RawTable: React.ComponentClass<TableProps> = enhancer(PubSubTable);
RVTable.propTypes = { ...RVTable.propTypes, children: PropTypes.any };
RawTable.propTypes = RVTable.propTypes as any;
RawTable.defaultProps = RVTable.defaultProps as any;
