import React, { PureComponent, PropTypes } from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';
import { StyleSheet, Dimensions, View } from 'react-native';
import moment from 'moment';
import capitalize from 'lodash/capitalize';
import NoChart from './NoChart';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

const ChartSettings = {
  daily: {
    tickFormat: 'HH:mm',
    tickCount: 6,
  },
  weekly: {
    tickFormat: 'ddd Do',
    tickCount: 7,
  },
  monthly: {
    tickFormat: 'D/MM',
    tickCount: 31,
  },
};

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    unit: PropTypes.oneOf(['level', 'flow']),
    domain: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    minValue: PropTypes.number,
    midValue: PropTypes.number,
    maxValue: PropTypes.number,
  };

  static defaultProps = {
    unit: 'flow',
  };

  constructor(props) {
    super(props);
    this.computeChartSettings(props.domain);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.domain !== this.props.domain) {
      this.computeChartSettings(nextProps.domain);
    }
  }

  computeChartSettings = (domain) => {
    const [start, end] = domain;
    const duration = moment(end).diff(start, 'days');
    let period = 'daily';
    if (duration > 7) {
      period = 'monthly';
    } else if (duration > 1) {
      period = 'weekly';
    }
    const settings = ChartSettings[period];
    this.tickFormat = date => moment(date).format(settings.tickFormat);
    this.tickCount = settings.tickCount;
  };

  render() {
    const { data, domain, unit } = this.props;
    if (data.length === 0) {
      return (<NoChart />);
    }
    return (
      <View style={styles.container}>
        <VictoryChart
          width={width}
          height={width}
          padding={{ top: 16, bottom: 32, left: 48, right: 16 }}
          scale={{ x: 'time', y: 'linear' }}
          domain={{ x: domain }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickFormat={this.tickFormat}
            tickCount={this.tickCount}
          />
          <VictoryAxis
            dependentAxis
            label={capitalize(unit)}
          />
          <VictoryLine
            data={data}
            x="date"
            y={this.props.unit}
            interpolation="monotoneX"
            style={{ data: { strokeWidth: 1 } }}
          />
        </VictoryChart>
      </View>
    );
  }
}

export default Chart;
