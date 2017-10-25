import * as React from 'react';
import { Column } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { ResourcesList } from '../../../layout';
import { WithGaugesList } from '../../../ww-clients/features/gauges';
import { Gauge } from '../../../ww-commons/features/gauges/types';

type Props = WithGaugesList & WithDeleteMutation<'removeGauge'>;

export default class GaugesList extends React.PureComponent<Props> {
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
