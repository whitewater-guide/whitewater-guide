import React, {Component, PropTypes} from 'react';
import Chart from './Chart';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Measurements} from '../../api/measurements';

class ChartContainer extends Component {

  static propTypes = {
    subDomain: PropTypes.array.isRequired,
    chartDomain: PropTypes.array.isRequired,
    onDomainChange: PropTypes.func.isRequired,
    gaugeId: PropTypes.string.isRequired,
    measurements: PropTypes.array,
    ready: PropTypes.bool,
  };

  render() {
    const {chartDomain, measurements, onDomainChange} = this.props;
    return (
      <Chart data={measurements} domain={chartDomain} onDomainChange={onDomainChange}/>
    );
  }

}

export default createContainer(
  (props) => {
    const sub = Meteor.subscribe('measurements.forGauge', props.gaugeId, props.subDomain);
    const measurements = Measurements.find({gaugeId: props.gaugeId}).fetch();
    return {
      ready: sub.ready(),
      measurements: measurements || [],
    };
  },
  ChartContainer
);
