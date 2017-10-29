import * as React from 'react';
import { WithGauge } from '../../../ww-clients/features/gauges';

const GaugeDetails: React.StatelessComponent<WithGauge> = props => (
  <div>
    <span>{props.gauge.node.name}</span>
  </div>
);

export default GaugeDetails;
