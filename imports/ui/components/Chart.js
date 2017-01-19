import React, {Component, PropTypes} from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryTheme,
  VictoryZoom
} from 'victory';
import Dimensions from 'react-dimensions';
import moment from 'moment';

class Chart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    unit: PropTypes.oneOf(['level', 'flow']),
    domain: PropTypes.array.isRequired,
    onDomainChange: PropTypes.func.isRequired,
    minValue: PropTypes.number,
    midValue: PropTypes.number,
    maxValue: PropTypes.number,
    containerWidth: PropTypes.number,
    containerHeight: PropTypes.number,
  };

  render() {
    const {data, domain} = this.props;
    //<VictoryZoom zoomDomain={{x: domain}} onDomainChange={this.props.onDomainChange}>
    return (
      <VictoryChart scale={{x: 'time', y: 'linear'}} domain={{x: domain}}
                    width={this.props.containerWidth} height={this.props.containerHeight}
                    theme={VictoryTheme.material}>
        <VictoryAxis tickFormat={this.tickFormat}/>
        <VictoryAxis dependentAxis/>
        <VictoryLine data={data} x="date" y={this.props.unit}
                     interpolation="monotoneX" style={{data: {strokeWidth: 1}}}/>
        <VictoryScatter data={data} x="date" y={this.props.unit}
                        labelComponent={<VictoryTooltip labels={d => d.value}/>}/>
      </VictoryChart>
    );
  }

  tickFormat = (date) => {
    return moment(date).format('HH:mm DD/MM/YYYY');
  };
}

export default Dimensions()(Chart);