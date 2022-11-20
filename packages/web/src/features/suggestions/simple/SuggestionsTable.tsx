import { formatDate, sectionName } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/schema';
import parseISO from 'date-fns/parseISO';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TableProps } from 'react-virtualized';

import {
  AdminColumn,
  Column,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components';
import { StatusFilter } from '../components';
import { ListedSuggestionFragment } from './listSuggestions.generated';
import SuggestionItem from './SuggestionItem';
import SuggestionStatusView from './SuggestionStatusView';

const renderCreatedAt: TableCellRenderer<ListedSuggestionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return formatDate(parseISO(rowData.createdAt), 'dd MMM yyyy');
};

const renderSection: TableCellRenderer<ListedSuggestionFragment> = ({
  rowData,
}) => {
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

const renderSuggestion: TableCellRenderer<ListedSuggestionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return <SuggestionItem suggestion={rowData} />;
};

interface OwnProps {
  data: ListedSuggestionFragment[];
  registerChild: (registeredChild: any) => void;
  onPressResolve: (id: string) => void;
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestionsTable = React.memo((props: Props) => {
  const {
    data,
    registerChild,
    onRowsRendered,
    onPressResolve,
    statusFilter,
    setStatusFilter,
  } = props;

  const renderAuthor: TableCellRenderer<ListedSuggestionFragment> = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return rowData.createdBy ? rowData.createdBy.name : '';
    },
    [],
  );

  const renderResolveButton: TableCellRenderer<ListedSuggestionFragment> =
    useCallback(
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
      <AdminColumn
        width={120}
        label="Author"
        dataKey="createdBy"
        cellRenderer={renderAuthor}
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

SuggestionsTable.displayName = 'SuggestionsTable';

export default SuggestionsTable;
