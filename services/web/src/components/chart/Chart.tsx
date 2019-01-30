import moment from 'moment';
import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from 'victory';
import { ChartComponentProps } from '@whitewater-guide/clients';

const tickFormat = (date: Date) => {
  return moment(date).format('HH:mm DD/MM/YYYY');
};

interface State {
  width: number;
  height: number;
}

class Chart extends React.PureComponent<ChartComponentProps, State> {
  state: State = {
    width: 0,
    height: 0,
  };

  onResize = (width: number, height: number) =>
    this.setState({ width, height });

  render() {
    const { width, height } = this.state;
    const { data, unit } = this.props;
    return (
      <React.Fragment>
        <VictoryChart
          scale={{ x: 'time', y: 'linear' }}
          width={width}
          height={height}
          theme={VictoryTheme.material}
        >
          <VictoryAxis tickFormat={tickFormat} />
          <VictoryAxis dependentAxis />
          <VictoryLine
            data={data}
            x="timestamp"
            y={unit}
            interpolation="monotoneX"
            style={{ data: { strokeWidth: 1 } }}
          />
          <VictoryScatter data={data} x="timestamp" y={unit} />
        </VictoryChart>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.onResize}
        />
      </React.Fragment>
    );
  }
}

export default Chart;
