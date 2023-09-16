import React from 'react';
import type { ColumnProps } from 'react-virtualized';
import { Column } from 'react-virtualized';

import { AdminColumn } from './AdminColumn';
import { BooleanColumn } from './BooleanColumn';
import { EditorColumn } from './EditorColumn';
import { renderBooleanCell } from './renderBooleanCell';
import { renderMUICell } from './renderMUICell';
import { renderMUIHeaderCell } from './renderMUIHeaderCell';

const mapRenderers = (props: ColumnProps): ColumnProps => ({
  ...props,
  cellRenderer: renderMUICell(props.cellRenderer),
  headerRenderer: renderMUIHeaderCell(props.headerRenderer),
});

const columnMapper =
  (isAdmin: boolean, isEditor: boolean) => (column: React.ReactChild) => {
    if (typeof column === 'string' || typeof column === 'number') {
      return null;
    }

    if (column.type === Column) {
      return React.createElement(
        Column as React.ComponentClass<any>,
        mapRenderers(column.props),
      );
    }
    if (column.type === AdminColumn) {
      return isAdmin
        ? React.createElement(
            Column as React.ComponentClass<any>,
            mapRenderers(column.props),
          )
        : null;
    }
    if (column.type === EditorColumn) {
      return isAdmin || isEditor
        ? React.createElement(
            Column as React.ComponentClass<any>,
            mapRenderers(column.props),
          )
        : null;
    }
    if (column.type === BooleanColumn) {
      const { iconFalse, iconTrue, adminOnly, ...props } = column.props;
      if (!isAdmin && adminOnly) {
        return null;
      }
      return React.createElement(Column as React.ComponentClass<any>, {
        ...props,
        cellRenderer: renderBooleanCell(iconTrue, iconFalse),
        headerRenderer: renderMUIHeaderCell(props.headerRenderer),
      });
    }
    return column;
  };

export default columnMapper;
