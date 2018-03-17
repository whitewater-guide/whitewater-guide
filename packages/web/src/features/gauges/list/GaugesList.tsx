import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { AdminColumn, MutationToggle } from '../../../components';
import { ResourcesList } from '../../../layout';
import { emitter, POKE_TABLES } from '../../../utils';
import { Gauge } from '../../../ww-commons';
import { GaugesListProps } from './types';

export default class GaugesList extends React.PureComponent<GaugesListProps> {
  onGaugeClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: Gauge) => `/sources/${row.source.id}/gauges/${row.id}/settings`;

  toggleGauge = async (id: string, enabled: boolean) => {
    await this.props.toggleGauge(id, enabled);
    emitter.emit(POKE_TABLES);
  };

  renderEnabled: TableCellRenderer = ({ rowData: { id, enabled } }) => (
    <MutationToggle id={id} enabled={enabled} toggle={this.toggleGauge} />
  );

  renderRequestParams: TableCellRenderer = ({ rowData: { requestParams } }) => {
    return requestParams ? JSON.stringify(requestParams) : null;
  };

  render() {
    return (
      <ResourcesList
        list={this.props.gauges.nodes}
        onResourceClick={this.onGaugeClick}
        resourceType="gauge"
        customSettingsLink={this.customSettingsLink}
        deleteHandle={this.props.removeGauge}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={70} label="Code" dataKey="code" />
        <AdminColumn width={70} label="Cron" dataKey="cron" />
        <AdminColumn width={100} label="Request params" dataKey="rp" cellRenderer={this.renderRequestParams} />
        <AdminColumn width={70} label="Enabled" dataKey="enabled" cellRenderer={this.renderEnabled} />
      </ResourcesList>
    );
  }
}
