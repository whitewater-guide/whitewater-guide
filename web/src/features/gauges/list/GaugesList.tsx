import Toggle from 'material-ui/Toggle';
import * as React from 'react';
import { Column, TableCellRenderer } from 'react-virtualized';
import { AdminColumn } from '../../../components';
import { ResourcesList } from '../../../layout';
import { Gauge } from '../../../ww-commons';
import { GaugesListProps } from './types';

export default class GaugesList extends React.PureComponent<GaugesListProps> {
  onGaugeClick = (id: string) => console.log(id);

  customSettingsLink = (row: Gauge) => `/sources/${row.source.id}/gauges/${row.id}/settings`;

  renderEnabled: TableCellRenderer = ({ cellData, rowData: { id } }) => (
    <Toggle toggled={cellData} />
  );

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
        <AdminColumn width={70} label="Enabled" dataKey="enabled" cellRenderer={this.renderEnabled} />
      </ResourcesList>
    );
  }
}
