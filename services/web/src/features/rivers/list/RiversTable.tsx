import React, { useCallback } from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { EditorColumn, Table } from '../../../components/tables';
import { ListedRiver } from './listRivers.query';
import RiversTableActions from './RiversTableActions';

const renderAltNames: TableCellRenderer = ({ rowData: { altNames } }) =>
  altNames ? altNames.join(', ') : '';

const renderNumSections: TableCellRenderer = ({
  rowData: {
    sections: { count },
  },
}) => count;

interface Props {
  rivers: ListedRiver[];
  onRemove: (id: string) => void;
  onChangeRegion: (id: string) => void;
}

const RiversTable: React.FC<Props> = React.memo((props) => {
  const { rivers, onRemove, onChangeRegion } = props;

  const renderActions: TableCellRenderer = useCallback(
    ({ rowData: river }) => {
      return (
        <RiversTableActions
          river={river}
          onRemove={onRemove}
          onChangeRegion={onChangeRegion}
        />
      );
    },
    [onRemove, onChangeRegion],
  );

  return (
    <Table data={rivers}>
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
