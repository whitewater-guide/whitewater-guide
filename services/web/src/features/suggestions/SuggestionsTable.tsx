import { formatDate } from '@whitewater-guide/clients';
import {
  Section,
  sectionName,
  Suggestion,
  SuggestionStatus,
} from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Column, TableCellRenderer, TableProps } from 'react-virtualized';
import { Table } from '../../components';
import StatusFilter from './StatusFilter';
import SuggestionItem from './SuggestionItem';
import SuggestionStatusView from './SuggestionStatusView';

const renderCreatedAt: TableCellRenderer = ({ rowData: { createdAt } }) =>
  formatDate(parseISO(createdAt), 'dd MMM yyyy');

const renderSection: TableCellRenderer = ({ rowData: { section } }) => {
  const { id, region } = section as Section;
  return (
    <Link to={`/regions/${region.id}/sections/${id}#main`}>
      {sectionName(section)}
    </Link>
  );
};

const renderSuggestion: TableCellRenderer = ({ rowData }) => (
  <SuggestionItem suggestion={rowData} />
);

interface OwnProps {
  data: Suggestion[];
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

  const renderResolveButton = useCallback(
    ({ rowData }: any) => (
      <SuggestionStatusView
        suggestion={rowData}
        onPressResolve={onPressResolve}
      />
    ),
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
