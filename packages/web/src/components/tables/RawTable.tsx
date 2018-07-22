import PropTypes from 'prop-types';
import React from 'react';
import { Column, Table as RVTable, TableProps } from 'react-virtualized';
import { compose, mapProps } from 'recompose';
import { emitter, POKE_TABLES } from '../../utils';
import { consumeRegion, WithRegion } from '../../ww-clients/features/regions';
import { WithMe, withMe } from '../../ww-clients/features/users';
import { AdminColumn } from './AdminColumn';
import { BooleanColumn, renderBoolean } from './BooleanColumn';
import { EditorColumn } from './EditorColumn';

const columnMapper = (isAdmin: boolean, isEditor: boolean) => (column: React.ReactChild) => {
  if (typeof column === 'string' || typeof column === 'number') {
    return null;
  } else if (column.type === AdminColumn as React.ComponentClass<any>) {
    return isAdmin ? React.createElement(Column as React.ComponentClass<any>, column.props) : null;
  } else if (column.type === EditorColumn as React.ComponentClass<any>) {
    return isEditor ? React.createElement(Column as React.ComponentClass<any>, column.props) : null;
  } else if (column.type === BooleanColumn as React.ComponentClass<any>) {
    const { iconFalse, iconTrue, ...props } = column.props;
    return React.createElement(Column as React.ComponentClass<any>, {
      ...props,
      cellRenderer: renderBoolean(iconTrue, iconFalse),
    });
  }
  return column;
};

const enhancer = compose<TableProps, TableProps>(
  withMe,
  consumeRegion(),
  mapProps(({ me, children, region, ...props }: WithMe & WithRegion & TableProps) => {
    const isEditor = !!region && !!region.node && region.node.editable;
    const isAdmin = !!me && me.admin;
    return {
      children: React.Children.map(children, columnMapper(isAdmin, isEditor)),
      ...props,
    };
  }),
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
