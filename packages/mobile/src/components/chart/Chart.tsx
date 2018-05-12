import { scaleLinear } from 'd3-scale';
import compact from 'lodash/compact';
import filter from 'lodash/filter';
import isFinite from 'lodash/isFinite';
import moment from 'moment';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import theme from '../../theme';
import { ChartComponentProps } from '../../ww-clients/features/charts';
import { Unit } from '../../ww-commons';
import HorizontalGridLine from './HorizontalGridLine';
import { NoChart } from './NoChart';
import TimeGridLine from './TimeGridLine';
import TimeLabel from './TimeLabel';
import { Period } from './types';
import YAxis from './YAxis';
import YLabel from './YLabel';
import YTick from './YTick';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'stretch',
  },
});

const ChartSettings = {
  [Period.DAY]: {
    tickFormat: 'HH:mm',
    tickCount: 6,
  },
  [Period.WEEK]: {
    tickFormat: 'ddd Do',
    tickCount: 7,
  },
  [Period.MONTH]: {
    tickFormat: 'D MMM',
    tickCount: 31,
  },
};

interface State {
  height: number;
}

export class Chart extends React.PureComponent<ChartComponentProps, State> {

  _xDomain: [Date, Date];
  _yDomain: [number, number] = [0, 0];
  _yTickValues: number[] = [];
  _period: Period = Period.DAY;
  _xTickFormat: (date: Date) => string;
  _xTickCount: number = 0;

  state: State = { height: 0 };

  constructor(props: ChartComponentProps) {
    super(props);
    this.computeDomain(props);
  }

  onLayout = ({ nativeEvent: { layout: { height } } }: LayoutChangeEvent) => this.setState({ height });

  componentWillReceiveProps(next: ChartComponentProps) {
    // if (nextProps.domain !== this.props.domain) {
    //   this.computeChartSettings(nextProps.domain);
    // }
    if (next.data !== this.props.data || next.unit !== this.props.unit) {
      this.computeDomain(next);
    }
  }

  computeDomain = (props: ChartComponentProps): [number, number] => {
    const { data, unit, section } = props;
    if (!data || data.length === 0) {
      this._yDomain = [0, 0];
      return;
    }
    let result = data.reduce(
      ([min, max], { [unit]: value }) => [Math.min(value, min), Math.max(value, max)],
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    );
    let ticks = [];
    const binding = section && (unit === Unit.LEVEL ? section.levels : section.flows);
    if (binding) {
      const { minimum, maximum, optimum, impossible } = binding;
      result = [
        Math.min.apply(null, filter([result[0], minimum, maximum, optimum], isFinite)),
        Math.max.apply(null, filter([result[1], minimum, maximum, optimum], isFinite)),
      ];
      ticks = compact([minimum, maximum, optimum, impossible]);
    }
    // Manually apply padding. Chart is square (height === screen width)
    const delta = (result[1] - result[0]) * (8 / theme.screenWidth);

    this._yDomain = [result[0] - delta, result[1] + delta];
    this._yTickValues = ticks.concat(scaleLinear().domain(this._yDomain).ticks(5));

    this._xDomain = [data[data.length - 1].timestamp, data[0].timestamp];
    const duration = moment(this._xDomain[1]).diff(this._xDomain[0], 'days');
    if (duration > 7) {
      this._period = Period.MONTH;
    } else if (duration > 1) {
      this._period = Period.WEEK;
    } else {
      this._period = Period.DAY;
    }
    const settings = ChartSettings[this._period];
    this._xTickFormat = (date: Date) => moment(date).format(settings.tickFormat);
    this._xTickCount = settings.tickCount;
  };

  render() {
    const { data, unit, section, gauge } = this.props;
    const binding = section && (unit === Unit.LEVEL ? section.levels : section.flows);
    const unitName = gauge[`${unit}Unit`];
    console.log(data);
    if (data.length === 0) {
      return (<NoChart noData />);
    }
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {
          this.state.height > 0 &&
          <VictoryChart
            width={theme.screenWidth}
            height={this.state.height}
            padding={{ top: 20, bottom: 54, left: 48, right: 16 }}
            scale={{ x: 'time', y: 'linear' }}
            domain={{ x: this._xDomain, y: this._yDomain }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickFormat={this._xTickFormat}
              tickCount={this._xTickCount}
              tickLabelComponent={<TimeLabel period={this._period} />}
              gridComponent={<TimeGridLine period={this._period} />}
            />
            <VictoryAxis
              dependentAxis
              tickValues={this._yTickValues}
              tickComponent={<YTick binding={binding} />}
              tickLabelComponent={<YLabel binding={binding} />}
              gridComponent={<HorizontalGridLine binding={binding} />}
              axisComponent={<YAxis unitName={unitName} />}
            />
            <VictoryLine
              data={data}
              x="timestamp"
              y={unit}
              interpolation="linear"
              style={{ data: { strokeWidth: 2 } }}
            />
          </VictoryChart>
        }
      </View>
    );
  }
}
