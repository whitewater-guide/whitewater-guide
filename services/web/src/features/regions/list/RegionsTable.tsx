import { Connection, filterRegions } from '@whitewater-guide/commons';
import React, { useCallback, useMemo, useState } from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import useRouter from 'use-react-router';
import { BooleanColumn, Table } from '../../../components/tables';
import { ListedRegion } from './listRegions.query';
import RegionNameFilter from './RegionNameFilter';
import RegionTableActions from './RegionTableActions';

const renderCount: TableCellRenderer = ({ cellData: { count } }) => count;

interface Props {
  regions: Required<Connection<ListedRegion>>;
  onRemove: (id?: string) => void;
}

const RegionsTable: React.FC<Props> = React.memo((props) => {
  const { regions, onRemove } = props;
  const { nodes, count } = regions;
  const { history } = useRouter();
  const [search, setSearch] = useState('');

  const renderNameHeader = useCallback(
    () => <RegionNameFilter search={search} setSearch={setSearch} />,
    [search, search],
  );

  const filtered = useMemo(() => filterRegions(nodes, { search }), [
    nodes,
    search,
  ]);

  const onRegionClick = useCallback(
    (id: string) => history.push(`/regions/${id}`),
    [history.push],
  );

  const renderActions: TableCellRenderer = useCallback(
    ({ rowData: region }) => {
      return <RegionTableActions region={region} onRemove={onRemove} />;
    },
    [onRemove],
  );

  return (
    <Table data={filtered} estimatedRowSize={count} onNodeClick={onRegionClick}>
      <Column
        width={200}
        flexGrow={1}
        label="Name"
        dataKey="name"
        headerRenderer={renderNameHeader}
      />
      <Column
        width={100}
        label="Gauges"
        dataKey="gauges"
        className="centered"
        headerClassName="centered"
        cellRenderer={renderCount}
      />
      <Column
        width={100}
        label="Rivers"
        dataKey="rivers"
        className="centered"
        headerClassName="centered"
        cellRenderer={renderCount}
      />
      <Column
        width={100}
        label="Sections"
        dataKey="sections"
        className="centered"
        headerClassName="centered"
        cellRenderer={renderCount}
      />
      <BooleanColumn
        width={80}
        label="Premium"
        dataKey="premium"
        iconTrue="grade"
        className="centered"
        headerClassName="centered"
        adminOnly={true}
      />
      <BooleanColumn
        width={80}
        label="Visible"
        dataKey="hidden"
        adminOnly={true}
        className="centered"
        headerClassName="centered"
        iconFalse="visibility"
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

RegionsTable.displayName = 'RegionsTable';

export default RegionsTable;
