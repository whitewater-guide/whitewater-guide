import * as moment from 'moment';
import * as React from 'react';
import Dimensions from 'react-dimensions';
import { VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';
import { ChartComponentProps } from '../../ww-clients/features/charts';

const tickFormat = (date: Date) => {
  return moment(date).format('HH:mm DD/MM/YYYY');
};

interface Props extends ChartComponentProps {
  containerWidth: number;
  containerHeight: number;
}

const Chart: React.StatelessComponent<Props> = (props) => (
  <VictoryChart
    scale={{ x: 'time', y: 'linear' }}
    domain={{x: props.domain}}
    width={props.containerWidth}
    height={props.containerHeight}
    theme={VictoryTheme.material}
  >
    <VictoryAxis tickFormat={tickFormat} />
    <VictoryAxis dependentAxis />
    <VictoryLine
      data={props.data}
      x="date"
      y={props.unit}
      interpolation="monotoneX"
      style={{ data: { strokeWidth: 1 } }}
    />
    <VictoryScatter
      data={props.data}
      x="date"
      y={props.unit}
    />
  </VictoryChart>
);

export default Dimensions()(Chart);
