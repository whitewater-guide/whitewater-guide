import {
  LogbookDescent,
  stringifyLogbookSection,
} from '@whitewater-guide/logbook-schema';
import React, { useCallback } from 'react';
import { Column } from 'react-virtualized';
import useRouter from 'use-react-router';
import {
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components/tables';
import { paths } from '../../../utils';
import DescentTableActions from './DescentTableActions';

const renderName: TableCellRenderer<LogbookDescent> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return stringifyLogbookSection(rowData.section);
};

const renderStartedAt: TableCellRenderer<LogbookDescent> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return rowData.startedAt;
};

interface Props {
  descents: LogbookDescent[];
  onRemove?: (id?: string) => void;
}

const DescentsTable: React.FC<Props> = React.memo((props) => {
  const { descents, onRemove } = props;
  const { history } = useRouter();

  const onDescentClick = useCallback(
    (id: string) => history.push(paths.to({ descentId: id })),
    [history.push],
  );

  const renderActions: TableCellRenderer<LogbookDescent> = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return <DescentTableActions descent={rowData} onRemove={onRemove} />;
    },
    [onRemove],
  );

  return (
    <Table data={descents} count={descents.length} onNodeClick={onDescentClick}>
      <Column
        width={200}
        flexGrow={1}
        label="Name"
        dataKey="name"
        cellRenderer={renderName}
      />
      <Column
        width={100}
        label="Started at"
        dataKey="startedAt"
        className="centered"
        headerClassName="centered"
        cellRenderer={renderStartedAt}
      />
      <Column
        width={170}
        label="Actions"
        dataKey="hidden"
        headerClassName="actions"
        cellRenderer={renderActions}
      />
    </Table>
  );
});

DescentsTable.displayName = 'DescentsTable';

export default DescentsTable;
