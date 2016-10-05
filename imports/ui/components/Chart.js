import React, { Component, PropTypes } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter } from 'victory-chart';
import { extent } from 'd3-array';
import moment from 'moment';

class Chart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    days: PropTypes.number,
    minValue: PropTypes.number,
    midValue: PropTypes.number,
    maxValue: PropTypes.number,
  };

  static defaultProps = {
    days: 1,
  };

  render() {
    const {data, days, minValue, midValue, maxValue} = this.props;
    const domain = {
      x: [moment().subtract(days, 'days').toDate(), new Date()],
      y: extent(data, d => d.value)
    };
    return (
      <VictoryChart domain={domain} scale={{ x: 'time', y: 'linear' }} padding={{ left: 80, right: 50, top: 20, bottom: 30 }} >
        <VictoryAxis tickFormat={this.tickFormat} />
        <VictoryAxis dependentAxis/>
        <VictoryLine data={data} x="date" y="value"
          interpolation="monotoneX" style={{ data: { strokeWidth: 1 } }} />
      </VictoryChart>
    );
  }

  tickFormat = (date) => {
    return moment(date).format('HH:mm DD/MM/YYYY');
  };
}

export default Chart;