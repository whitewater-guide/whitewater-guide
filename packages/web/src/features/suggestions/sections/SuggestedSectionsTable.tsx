import { formatDate } from '@whitewater-guide/clients';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { Link } from 'react-router-dom';
import { TableProps } from 'react-virtualized';

import {
  Column,
  IconLink,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components';
import { paths } from '../../../utils';
import { SuggestedSectionFragment } from './suggestedSections.generated';

const renderCreatedAt: TableCellRenderer<SuggestedSectionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData) || !rowData.createdAt) {
    return null;
  }
  return formatDate(parseISO(rowData.createdAt), 'dd MMM yyyy');
};

const renderRegion: TableCellRenderer<SuggestedSectionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { region } = rowData;
  return <Link to={`/regions/${region.id}`}>{region.name}</Link>;
};

const renderSection: TableCellRenderer<SuggestedSectionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { name, river } = rowData;
  return `${river.name} - ${name}`;
};

const renderAuthor: TableCellRenderer<SuggestedSectionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return rowData?.createdBy?.name || '';
};
const renderActions: TableCellRenderer<SuggestedSectionFragment> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return (
    <IconLink
      to={paths.settings({
        regionId: rowData.region.id,
        sectionId: rowData.id,
      })}
      icon="edit"
    />
  );
};

interface OwnProps {
  data: SuggestedSectionFragment[];
  registerChild: (registeredChild: any) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestedSectionsTable = React.memo((props: Props) => {
  const { data, registerChild, onRowsRendered } = props;

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
        flexGrow={1}
        label="Region"
        dataKey="region"
        cellRenderer={renderRegion}
      />
      <Column
        width={200}
        flexGrow={5}
        label="Name"
        dataKey="name"
        cellRenderer={renderSection}
      />
      <Column
        width={120}
        flexGrow={1}
        dataKey="createdBy"
        label="Author"
        cellRenderer={renderAuthor}
      />
      <Column
        width={100}
        dataKey="createdBy"
        label="Actions"
        headerClassName="actions"
        cellRenderer={renderActions}
      />
    </Table>
  );
});

SuggestedSectionsTable.displayName = 'SuggestedSectionsTable';

export default SuggestedSectionsTable;
