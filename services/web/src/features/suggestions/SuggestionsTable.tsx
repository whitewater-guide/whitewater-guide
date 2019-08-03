import { formatDate } from '@whitewater-guide/clients';
import { Section, sectionName, Suggestion } from '@whitewater-guide/commons';
import parseISO from 'date-fns/parseISO';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column, TableCellRenderer, TableProps } from 'react-virtualized';
import { Table } from '../../components';

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

interface OwnProps {
  data: Suggestion[];
  registerChild: (registeredChild: any) => void;
}

type Props = OwnProps &
  Omit<TableProps, 'rowGetter' | 'rowCount' | 'rowHeight' | 'headerHeight'>;

const SuggestionsTable: React.FC<Props> = React.memo((props) => {
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
        width={200}
        flexGrow={1}
        label="Section"
        dataKey="section"
        cellRenderer={renderSection}
      />
      <Column
        width={200}
        flexGrow={4}
        label="Description"
        dataKey="description"
      />
      <Column width={116} label="Photo" dataKey="thumb" />
    </Table>
  );
});

export default SuggestionsTable;
