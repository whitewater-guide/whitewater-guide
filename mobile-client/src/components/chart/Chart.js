import React, { Component, PropTypes } from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';
import moment from 'moment';
import NoChart from './NoChart';

class Chart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    unit: PropTypes.oneOf(['level', 'flow']).isRequired,
    domain: PropTypes.array.isRequired,
    onDomainChanged: PropTypes.func.isRequired,
    minValue: PropTypes.number,
    midValue: PropTypes.number,
    maxValue: PropTypes.number,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
  };

  tickFormat = date => moment(date).format('HH:mm DD/MM/YYYY');

  render() {
    const { data, domain } = this.props;
    if (!data || data.length === 0) {
      return (<NoChart />);
    }
    return (
      <VictoryChart
        scale={{ x: 'time', y: 'linear' }}
        domain={{ x: domain }}
        width={this.props.containerWidth}
        height={this.props.containerHeight}
        theme={VictoryTheme.material}
      >
        <VictoryAxis tickFormat={this.tickFormat} />
        <VictoryAxis dependentAxis />
        <VictoryLine
          data={data}
          x="date"
          y={this.props.unit}
          interpolation="monotoneX"
          style={{ data: { strokeWidth: 1 } }}
        />
      </VictoryChart>
    );
  }
}

export default Chart;
