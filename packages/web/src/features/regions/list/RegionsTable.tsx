import { useRegionsFilterOptions } from '@whitewater-guide/clients';
import { Connection, filterRegions } from '@whitewater-guide/commons';
import React, { useCallback, useMemo } from 'react';
import { Column } from 'react-virtualized';
import useRouter from 'use-react-router';

import { UnstyledLink } from '../../../components';
import {
  BooleanColumn,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components/tables';
import { paths } from '../../../utils';
import { ListedRegion } from './listRegions.query';
import RegionNameFilter from './RegionNameFilter';
import RegionTableActions from './RegionTableActions';

const renderName: TableCellRenderer<ListedRegion, Connection<any>> = ({
  rowData,
}) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return (
    <UnstyledLink regionId={rowData.id} suffix="/sections">
      {rowData.name}
    </UnstyledLink>
  );
};

const renderCount: TableCellRenderer<ListedRegion, Connection<any>> = ({
  cellData,
}) => (cellData ? cellData.count : null);

interface Props {
  regions: Required<Connection<ListedRegion>>;
  onRemove: (id?: string) => void;
}

const RegionsTable: React.FC<Props> = React.memo((props) => {
  const { regions, onRemove } = props;
  const { nodes, count } = regions;
  const { history } = useRouter();
  const filter = useRegionsFilterOptions();

  const renderNameHeader = useCallback(() => <RegionNameFilter />, []);

  const filtered = useMemo(() => filterRegions(nodes, filter), [nodes, filter]);

  const onRegionClick = useCallback(
    (id: string) =>
      history.push(paths.to({ regionId: id, suffix: '/sections' })),
    [history],
  );

  const renderActions: TableCellRenderer<ListedRegion> = useCallback(
    ({ rowData }) => {
      if (isEmptyRow(rowData)) {
        return null;
      }
      return <RegionTableActions region={rowData} onRemove={onRemove} />;
    },
    [onRemove],
  );

  return (
    <Table data={filtered} count={count} onNodeClick={onRegionClick}>
      <Column
        width={200}
        flexGrow={1}
        label="Name"
        dataKey="name"
        headerRenderer={renderNameHeader}
        cellRenderer={renderName}
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
