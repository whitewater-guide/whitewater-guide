import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import { StyleSheet, Dimensions, View } from 'react-native';
import moment from 'moment';
import { capitalize, compact } from 'lodash';
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
    this._period = '';
    this._tickFormat = '';
    this._tickCount = 0;
    this.computeChartSettings(props.domain);
    this._domain = this.computeDomain(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.domain !== this.props.domain) {
      this.computeChartSettings(nextProps.domain);
    }
    if (nextProps.data !== this.props.data) {
      this._domain = this.computeDomain(nextProps);
    }
  }

  computeDomain = ({ data, unit, binding }) => {
    if (!data) {
      return [0, 0];
    }
    let result = data.reduce(
      ([min, max], { [unit]: value }) => [Math.min(value, min), Math.max(value, max)],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
    if (binding) {
      const { minimum, maximum, optimum } = binding;
      result = [
        Math.min.apply(null, compact([result[0], minimum, maximum, optimum])),
        Math.max.apply(null, compact([result[1], minimum, maximum, optimum])),
      ];
    }
    // Manually apply padding. Chart is square (height === screen width)
    const delta = (result[1] - result[0]) * (8 / width);
    return [result[0] - delta, result[1] + delta];
  };

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
    this._period = period;
    this._tickFormat = date => moment(date).format(settings.tickFormat);
    this._tickCount = settings.tickCount;
  };

  renderBindingLine = (color, value, key) => {
    const { domain } = this.props;
    const data = [
      { x: domain[0], y: value },
      { x: domain[1], y: value },
    ];
    return (
      <VictoryLine
        key={`binding_${key}`}
        data={data}
        style={{ data: { strokeWidth: 1, strokeDasharray: '5,5', stroke: color } }}
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
      result.push(this.renderBindingLine('blue', minimum, 'minimum'));
    }
    if (maximum) {
      result.push(this.renderBindingLine('red', maximum, 'maximum'));
    }
    if (optimum) {
      result.push(this.renderBindingLine('green', optimum, 'optimum'));
    }
    if (impossible && impossible <= this._domain[1]) {
      result.push(this.renderBindingLine('maroon', impossible, 'impossible'));
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
          domain={{ x: domain, y: this._domain }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            tickFormat={this._tickFormat}
            tickCount={this._tickCount}
            tickLabelComponent={<TimeLabel angle={90} period={this._period} />}
            gridComponent={<TimeGridLine period={this._period} />}
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
            style={{ data: { strokeWidth: 2 } }}
          />
        </VictoryChart>
      </View>
    );
  }
}

export default Chart;
