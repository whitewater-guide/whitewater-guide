import { formatDate } from '@whitewater-guide/clients';
import { sectionName, SuggestionStatus } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Column, TableProps } from 'react-virtualized';
import { isEmptyRow, Table, TableCellRenderer } from '../../../components';
import { StatusFilter } from '../components';
import { ListedSuggestion } from './listSuggestions.query';
import SuggestionItem from './SuggestionItem';
import SuggestionStatusView from './SuggestionStatusView';

const renderCreatedAt: TableCellRenderer<ListedSuggestion> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return formatDate(parseISO(rowData.createdAt), 'dd MMM yyyy');
};

const renderSection: TableCellRenderer<ListedSuggestion> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { id, region } = rowData.section;
  return (
    <Link to={`/regions/${region.id}/sections/${id}#main`}>
      {sectionName(rowData.section)}
    </Link>
  );
};

const renderSuggestion: TableCellRenderer<ListedSuggestion> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return <SuggestionItem suggestion={rowData} />;
};

interface OwnProps {
  data: ListedSuggestion[];
  registerChild: (registeredChild: any) => void;
  onPressResolve: (id: string) => void;
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestionsTable: React.FC<Props> = React.memo((props) => {
  const {
    data,
    registerChild,
    onRowsRendered,
    onPressResolve,
    statusFilter,
    setStatusFilter,
  } = props;

  const renderResolveButton: TableCellRenderer<ListedSuggestion> = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return (
        <SuggestionStatusView
          suggestion={rowData}
          onPressResolve={onPressResolve}
        />
      );
    },
    [onPressResolve],
  );

  const renderStatusHeader = useCallback(
    () => <StatusFilter status={statusFilter} onChange={setStatusFilter} />,
    [statusFilter, setStatusFilter],
  );

  return (
    <Table
      ref={registerChild}
      data={data}
      onRowsRendered={onRowsRendered}
      rowHeight={116}
    >
      <Column
        width={100}
        label="Date"
        dataKey="createdAt"
        cellRenderer={renderCreatedAt}
      />
      <Column
        width={250}
        label="Section"
        dataKey="section"
        cellRenderer={renderSection}
      />
      <Column
        width={200}
        flexGrow={4}
        label="Suggestion"
        dataKey="description"
        cellRenderer={renderSuggestion}
      />
      <Column
        width={120}
        dataKey="status"
        label="Status"
        headerClassName="actions"
        headerRenderer={renderStatusHeader}
        cellRenderer={renderResolveButton}
      />
    </Table>
  );
});

export default SuggestionsTable;
