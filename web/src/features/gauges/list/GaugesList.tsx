import * as React from 'react';
import { Column } from 'react-virtualized';
import { WithDeleteMutation } from '../../../apollo';
import { ResourcesList } from '../../../layout';
import { WithGaugesList } from '../../../ww-clients/features/gauges';

type Props = WithGaugesList & WithDeleteMutation<'removeGauge'>;

export class GaugesList extends React.PureComponent<Props> {
  onGaugeClick = (id: string) => console.log(id);

  render() {
    return (
      <ResourcesList
        list={this.props.gauges.nodes}
        onResourceClick={this.onGaugeClick}
        resourceType="gauge"
        deleteHandle={this.props.removeGauge}
      >
        <Column width={200} label="Name" dataKey="name" />
        <Column width={70} label="Code" dataKey="code" />
      </ResourcesList>
    );
  }
}
