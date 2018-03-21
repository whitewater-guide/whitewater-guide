import React from 'react';
import { WithMeasurements } from '../../../../ww-clients/features/measurements';

class GaugeChart extends React.PureComponent<WithMeasurements> {
  render() {
    return (
      <div>
        {JSON.stringify(this.props.measurements, null,  2)}
      </div>
    );
  }
}

export default GaugeChart;
