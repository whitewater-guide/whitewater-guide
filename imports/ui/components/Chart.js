import React, { Component, PropTypes } from 'react';
import { round } from 'lodash';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter } from 'victory-chart';

class Chart extends Component {
  static propTypes = {
    data: PropTypes.array,
    minValue: PropTypes.number,
    midValue: PropTypes.number,
    maxValue: PropTypes.number,
  };

  render() {
    const {data, minValue, midValue, maxValue} = this.props;
    return (
      <VictoryChart padding={{ left: 80, right: 50, top: 20, bottom: 30 }} >
        <VictoryLine data={data} scale="time" x="date" y="value"
          interpolation="monotoneX" style={{ data: { strokeWidth: 1 } }} />
      </VictoryChart>
    );
  }
}

export default Chart;