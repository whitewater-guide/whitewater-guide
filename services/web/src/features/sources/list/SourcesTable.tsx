import { HarvestMode, Source } from '@whitewater-guide/commons';
import { History } from 'history';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import {
  ClickBlocker,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  MutationToggle,
} from '../../../components';
import { AdminColumn, Table } from '../../../components/tables';
import { paths } from '../../../utils';

interface Props {
  sources: Source[];
  history: History;
  onRemove: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

export default class SourcesTable extends React.PureComponent<Props> {
  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

  toggleSource = async (id: string, enabled: boolean) => {
    await this.props.onToggle(id, enabled);
  };

  renderEnabled: TableCellRenderer = ({ rowData: { id, enabled } }) => (
    <MutationToggle id={id} enabled={enabled} toggle={this.toggleSource} />
  );

  renderStatus: TableCellRenderer = ({ rowData: { harvestMode, status } }) => {
    const showStatus = harvestMode === HarvestMode.ALL_AT_ONCE;
    return showStatus ? <HarvestStatusIndicator status={status} /> : null;
  };

  renderCron: TableCellRenderer = ({ rowData: { cron, harvestMode } }) =>
    harvestMode === HarvestMode.ONE_BY_ONE ? null : cron;

  renderActions: TableCellRenderer = ({ rowData: { id: sourceId } }) => {
    return (
      <ClickBlocker>
        <IconLink to={paths.settings({ sourceId })} icon="edit" />
        <DeleteButton id={sourceId} deleteHandler={this.props.onRemove} />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <Table data={this.props.sources} onNodeClick={this.onSourceClick}>
        <Column width={200} flexGrow={1} label="Name" dataKey="name" />
        <Column
          width={100}
          label="Harvest mode"
          dataKey="harvestMode"
          headerClassName="centered"
        />
        <AdminColumn
          width={70}
          label="Status"
          dataKey="status"
          className="centered"
          headerClassName="centered"
          cellRenderer={this.renderStatus}
        />
        <AdminColumn
          width={70}
          label="Cron"
          dataKey="cron"
          cellRenderer={this.renderCron}
        />
        <AdminColumn
          width={70}
          label="Enabled"
          dataKey="enabled"
          headerClassName="centered"
          cellRenderer={this.renderEnabled}
        />
        <AdminColumn
          width={120}
          label="Actions"
          dataKey="action"
          headerClassName="actions"
          cellRenderer={this.renderActions}
        />
      </Table>
    );
  }
}
