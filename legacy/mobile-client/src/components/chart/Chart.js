import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import { scaleLinear } from 'd3-scale';
import moment from 'moment';
import { compact, filter, isFinite } from 'lodash';
import NoChart from './NoChart';
import TimeLabel from './TimeLabel';
import HorizontalGridLine from './HorizontalGridLine';
import YLabel from './YLabel';
import YTick from './YTick';
import YAxis from './YAxis';
import TimeGridLine from './TimeGridLine';
import ChartTheme from './ChartTheme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'stretch',
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
    flowUnit: PropTypes.string,
    levelUnit: PropTypes.string,
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
    this._yTickValues = [];
    this.computeChartSettings(props.domain);
    this.computeDomain(props);
    this.state = {
      height: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.domain !== this.props.domain) {
      this.computeChartSettings(nextProps.domain);
    }
    if (nextProps.data !== this.props.data) {
      this.computeDomain(nextProps);
    }
  }

  onLayout = ({ nativeEvent: { layout: { height } } }) => this.setState({ height });

  computeDomain = ({ data, unit, binding }) => {
    if (!data || data.length === 0) {
      this._yDomain = [0, 0];
      return;
    }
    let result = data.reduce(
      ([min, max], { [unit]: value }) => [Math.min(value, min), Math.max(value, max)],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
    let ticks = [];
    if (binding) {
      const { minimum, maximum, optimum, impossible } = binding;
      result = [
        Math.min.apply(null, filter([result[0], minimum, maximum, optimum], isFinite)),
        Math.max.apply(null, filter([result[1], minimum, maximum, optimum], isFinite)),
      ];
      ticks = compact([minimum, maximum, optimum, impossible]);
    }
    // Manually apply padding. Chart is square (height === screen width)
    const delta = (result[1] - result[0]) * (8 / width);
    this._yDomain = [result[0] - delta, result[1] + delta];

    this._yTickValues = ticks.concat(scaleLinear().domain(this._yDomain).ticks(5));
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

  render() {
    const { binding, data, domain, unit } = this.props;
    if (data.length === 0) {
      return (<NoChart noData />);
    }
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {
          this.state.height > 0 &&
          <VictoryChart
            width={width}
            height={this.state.height}
            padding={{ top: 20, bottom: 48, left: 48, right: 16 }}
            scale={{ x: 'time', y: 'linear' }}
            domain={{ x: domain, y: this._yDomain }}
            theme={ChartTheme}
          >
            <VictoryAxis
              tickFormat={this._tickFormat}
              tickCount={this._tickCount}
              tickLabelComponent={<TimeLabel angle={90} period={this._period} />}
              gridComponent={<TimeGridLine period={this._period} />}
            />
            <VictoryAxis
              dependentAxis
              tickValues={this._yTickValues}
              tickComponent={<YTick binding={binding} />}
              tickLabelComponent={<YLabel binding={binding} />}
              gridComponent={<HorizontalGridLine binding={binding} />}
              axisComponent={<YAxis unit={this.props[`${unit}Unit`]} />}
            />
            <VictoryLine
              data={data}
              x="date"
              y={this.props.unit}
              interpolation="linear"
              style={{ data: { strokeWidth: 2 } }}
            />
          </VictoryChart>
        }
      </View>
    );
  }
}

export default Chart;
