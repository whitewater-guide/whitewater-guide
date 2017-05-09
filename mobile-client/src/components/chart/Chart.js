import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
import TimeLabel from './TimeLabel';
import TimeGridLine from './TimeGridLine';

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
    tickFormat: 'D MMM',
    tickCount: 31,
  },
};

class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    unit: PropTypes.oneOf(['level', 'flow']),
    domain: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
    binding: PropTypes.shape({
      minimum: PropTypes.number,
      maximum: PropTypes.number,
      optimum: PropTypes.number,
      impossible: PropTypes.number,
      approximate: PropTypes.number,
    }),
  };

  static defaultProps = {
    unit: 'flow',
    binding: {},
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
    this.period = period;
    this.tickFormat = date => moment(date).format(settings.tickFormat);
    this.tickCount = settings.tickCount;
  };

  rednderBindingLine = (color, value, key) => {
    const { domain } = this.props;
    const data = [
      { x: domain[0], y: value },
      { x: domain[1], y: value },
    ];
    return (
      <VictoryLine
        key={`binding_${key}`}
        data={data}
        style={{ data: { strokeWidth: 1, stroke: color } }}
      />
    );
  };

  renderBindings = () => {
    const { binding } = this.props;
    if (!binding) {
      return null;
    }
    const { minimum, maximum, optimum, impossible } = binding;
    const result = [];
    if (minimum) {
      result.push(this.rednderBindingLine('blue', minimum, 'minimum'));
    }
    if (maximum) {
      result.push(this.rednderBindingLine('red', maximum, 'maximum'));
    }
    if (optimum) {
      result.push(this.rednderBindingLine('green', optimum, 'optimum'));
    }
    if (impossible) {
      result.push(this.rednderBindingLine('maroon', impossible, 'impossible'));
    }
    return result;
  };

  render() {
    const { data, domain, unit } = this.props;
    if (data.length === 0) {
      return (<NoChart noData />);
    }
    return (
      <View style={styles.container}>
        <VictoryChart
          width={width}
          height={width}
          padding={{ top: 16, bottom: 48, left: 48, right: 16 }}
          scale={{ x: 'time', y: 'linear' }}
          domain={{ x: domain }}
          domainPadding={{ y: 20 }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickFormat={this.tickFormat}
            tickCount={this.tickCount}
            tickLabelComponent={<TimeLabel angle={90} period={this.period} />}
            gridComponent={<TimeGridLine period={this.period} />}
          />
          <VictoryAxis
            dependentAxis
            label={capitalize(unit)}
          />
          { this.renderBindings() }
          <VictoryLine
            data={data}
            x="date"
            y={this.props.unit}
            interpolation="linear"
            style={{ data: { strokeWidth: 1 } }}
          />
        </VictoryChart>
      </View>
    );
  }
}

export default Chart;
