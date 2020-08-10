import { formatDate } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableProps } from 'react-virtualized';
import {
  IconLink,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components';
import { paths } from '../../../utils';

const renderCreatedAt: TableCellRenderer<Section> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return formatDate(parseISO(rowData.createdAt), 'dd MMM yyyy');
};

const renderRegion: TableCellRenderer<Section> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { region } = rowData;
  return <Link to={`/regions/${region.id}`}>{region.name}</Link>;
};

const renderSection: TableCellRenderer<Section> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  const { name, river } = rowData;
  return `${river.name} - ${name}`;
};

const renderAuthor: TableCellRenderer<Section> = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return rowData?.createdBy?.name || '';
};
const renderActions: TableCellRenderer<Section> = ({ rowData }) => {
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
  data: Section[];
  registerChild: (registeredChild: any) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestedSectionsTable: React.FC<Props> = React.memo((props) => {
  const { data, registerChild, onRowsRendered, onPressResolve } = props;

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

export default SuggestedSectionsTable;
