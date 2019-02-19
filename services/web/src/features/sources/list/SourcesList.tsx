import { HarvestMode } from '@whitewater-guide/commons';
import React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import {
  ClickBlocker,
  DeleteButton,
  HarvestStatusIndicator,
  IconLink,
  MutationToggle,
} from '../../../components';
import { AdminColumn } from '../../../components/tables';
import { ResourcesListCard } from '../../../layout';
import { emitter, paths, POKE_TABLES } from '../../../utils';
import { SourceListProps } from './types';

export default class SourcesList extends React.PureComponent<SourceListProps> {
  onSourceClick = (id: string) => this.props.history.push(`/sources/${id}`);

  toggleSource = async (id: string, enabled: boolean) => {
    await this.props.toggleSource(id, enabled);
    emitter.emit(POKE_TABLES);
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
        <DeleteButton id={sourceId} deleteHandler={this.props.removeSource} />
      </ClickBlocker>
    );
  };

  render() {
    return (
      <ResourcesListCard
        resourceType="source"
        list={this.props.sources.nodes}
        onResourceClick={this.onSourceClick}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={100} label="Harvest mode" dataKey="harvestMode" />
        <AdminColumn
          width={50}
          label="Status"
          dataKey="status"
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
          cellRenderer={this.renderEnabled}
        />
        <AdminColumn
          width={100}
          label="Actions"
          dataKey="action"
          cellRenderer={this.renderActions}
        />
      </ResourcesListCard>
    );
  }
}
