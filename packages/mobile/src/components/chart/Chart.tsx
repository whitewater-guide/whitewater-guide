import { scaleLinear } from 'd3-scale';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import theme from '../../theme';
import { ChartComponentProps } from '../../ww-clients/features/charts';
import NoChart from './NoChart';

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

interface State {
  height: number;
}

class Chart extends React.PureComponent<ChartComponentProps, State> {

  state: State = { height: 0 };

  onLayout = ({ nativeEvent: { layout: { height } } }: LayoutChangeEvent) => this.setState({ height });

  render() {
    const { data, unit } = this.props;
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
            padding={{ top: 20, bottom: 48, left: 48, right: 16 }}
            scale={{ x: 'time', y: 'linear' }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis />
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
