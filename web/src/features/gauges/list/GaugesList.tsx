import * as React from 'react';
import { Column } from 'react-virtualized';
import { ResourcesList } from '../../../layout';
import { Gauge } from '../../../ww-commons';
import { GaugesListProps } from './types';

export default class GaugesList extends React.PureComponent<GaugesListProps> {
  onGaugeClick = (id: string) => console.log(id);

  customSettingsLink = (row: Gauge) => `/sources/${row.source.id}/gauges/${row.id}`;

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
      </ResourcesList>
    );
  }
}
