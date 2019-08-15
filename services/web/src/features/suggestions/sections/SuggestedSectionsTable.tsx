import { formatDate } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Column, TableProps } from 'react-virtualized';
import { isEmptyRow, Table, TableCellRenderer } from '../../../components';
import { StatusFilter } from '../components';
import { ListedSuggestedSection } from './suggestedSections.query';
import SuggestedSectionStatusView from './SuggestedSectionStatusView';

const renderCreatedAt: TableCellRenderer<ListedSuggestedSection> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return formatDate(parseISO(rowData.createdAt), 'dd MMM yyyy');
};

const renderRegion: TableCellRenderer<ListedSuggestedSection> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { region } = rowData;
  return <Link to={`/regions/${region.id}`}>{region.name}</Link>;
};

const renderSection: TableCellRenderer<ListedSuggestedSection> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { name, river } = rowData;
  return `${river.name} - ${name}`;
};

interface OwnProps {
  data: ListedSuggestedSection[];
  registerChild: (registeredChild: any) => void;
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestedSectionsTable: React.FC<Props> = React.memo((props) => {
  const {
    data,
    registerChild,
    onRowsRendered,
    onPressResolve,
    statusFilter,
    setStatusFilter,
  } = props;

  const renderResolveButton: TableCellRenderer<
    ListedSuggestedSection
  > = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return <SuggestedSectionStatusView suggestedSection={rowData} />;
    },
    [onPressResolve],
  );

  const renderStatusHeader = useCallback(
    () => <StatusFilter status={statusFilter} onChange={setStatusFilter} />,
    [statusFilter, setStatusFilter],
  );

  return (
    <Table ref={registerChild} data={data} onRowsRendered={onRowsRendered}>
      <Column
        width={100}
        label="Date"
        dataKey="createdAt"
        cellRenderer={renderCreatedAt}
      />
      <Column
        width={100}
        label="Region"
        dataKey="region"
        cellRenderer={renderRegion}
      />
      <Column
        width={200}
        flexGrow={1}
        label="Name"
        dataKey="name"
        cellRenderer={renderSection}
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

export default SuggestedSectionsTable;
