import { useRegionsFilter } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';

import { UnstyledLink } from '../../../components';
import {
  BooleanColumn,
  Column,
  isEmptyRow,
  Table,
  TableCellRenderer,
} from '../../../components/tables';
import { paths } from '../../../utils';
import {
  ListedRegionFragment,
  ListRegionsQuery,
} from './listRegions.generated';
import RegionNameFilter from './RegionNameFilter';
import RegionTableActions from './RegionTableActions';

type TCR = TableCellRenderer<ListedRegionFragment, ListRegionsQuery['regions']>;

const renderName: TCR = ({ rowData }) => {
  if (isEmptyRow(rowData)) {
    return null;
  }
  return (
    <UnstyledLink regionId={rowData.id} suffix="/sections">
      {rowData.name}
    </UnstyledLink>
  );
};

const renderCount: TCR = ({ cellData }) => (cellData ? cellData.count : null);

interface Props {
  regions?: ListRegionsQuery['regions'];
  onRemove: (id?: string) => void;
}

const RegionsTable = React.memo<Props>((props) => {
  const { regions, onRemove } = props;
  const { nodes = [], count = 0 } = regions ?? {};
  const history = useHistory();
  const filtered = useRegionsFilter(nodes);

  const renderNameHeader = useCallback(() => <RegionNameFilter />, []);

  const onRegionClick = useCallback(
    (id: string) =>
      history.push(paths.to({ regionId: id, suffix: '/sections' })),
    [history],
  );

  const renderActions: TCR = useCallback(
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
        adminOnly
      />
      <BooleanColumn
        width={80}
        label="Visible"
        dataKey="hidden"
        adminOnly
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
