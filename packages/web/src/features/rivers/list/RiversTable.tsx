import React, { useCallback } from 'react';
import { Column } from 'react-virtualized';

import {
  EditorColumn,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components/tables';
import { ListedRiverFragment, ListRiversQuery } from './listRivers.generated';
import RiversTableActions from './RiversTableActions';

const renderAltNames: TableCellRenderer<ListedRiverFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { altNames } = rowData;
  return altNames ? altNames.join(', ') : '';
};

const renderNumSections: TableCellRenderer<ListedRiverFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return rowData.sections.count;
};

interface Props {
  rivers?: ListRiversQuery['rivers'];
  onRemove: (id: string) => void;
  onChangeRegion: (id: string) => void;
}

const RiversTable = React.memo<Props>((props) => {
  const { rivers = { nodes: [], count: 0 }, onRemove, onChangeRegion } = props;

  const renderActions: TableCellRenderer<ListedRiverFragment> = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return (
        <RiversTableActions
          river={rowData}
          onRemove={onRemove}
          onChangeRegion={onChangeRegion}
        />
      );
    },
    [onRemove, onChangeRegion],
  );

  return (
    <Table data={rivers.nodes} count={rivers.count}>
      <Column width={200} flexGrow={1} label="Name" dataKey="name" />
      <Column
        width={200}
        flexGrow={1}
        label="Alternative names"
        dataKey="altNames"
        cellRenderer={renderAltNames}
      />
      <Column
        width={90}
        label="# Sections"
        dataKey="sections"
        className="centered"
        headerClassName="centered"
        cellRenderer={renderNumSections}
      />
      <EditorColumn
        width={400}
        label="Actions"
        dataKey="actions"
        headerClassName="actions"
        cellRenderer={renderActions}
      />
    </Table>
  );
});

RiversTable.displayName = 'RiversTable';

export default RiversTable;
