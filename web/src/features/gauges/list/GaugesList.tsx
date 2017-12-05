import * as React from 'react';
import { Column, Table, TableCellRenderer } from 'react-virtualized';
import { AdminColumn } from '../../../components';
import { ResourcesList } from '../../../layout';
import { Gauge } from '../../../ww-commons';
import GaugeToggle from './GaugeToggle';
import { GaugesListProps } from './types';

interface State {
  // Pure virtualized table escape hatch
  // https://github.com/bvaughn/react-virtualized#pure-components
  refresher: number;
}

export default class GaugesList extends React.PureComponent<GaugesListProps, State> {
  state: State = { refresher: 0 };
  rawTable: Table | null;

  setRawTableRef = (ref: Table | null) => {this.rawTable = ref; };

  onGaugeClick = (id: string) => {
    // console.log(id);
  };

  customSettingsLink = (row: Gauge) => `/sources/${row.source.id}/gauges/${row.id}/settings`;

  toggleGauge = async (id: string, enabled: boolean) => {
    await this.props.toggleGauge(id, enabled);
    this.setState({ refresher: this.state.refresher + 1 });
  };

  renderEnabled: TableCellRenderer = ({ rowData: { id, enabled } }) => (
    <GaugeToggle id={id} enabled={enabled} toggleGauge={this.toggleGauge} />
  );

  render() {
    return (
      <ResourcesList
        list={this.props.gauges.nodes}
        onResourceClick={this.onGaugeClick}
        resourceType="gauge"
        customSettingsLink={this.customSettingsLink}
        deleteHandle={this.props.removeGauge}
        refresher={this.state.refresher}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={70} label="Code" dataKey="code" />
        <AdminColumn width={70} label="Enabled" dataKey="enabled" cellRenderer={this.renderEnabled} />
      </ResourcesList>
    );
  }
}
