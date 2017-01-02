import React, {Component, PropTypes} from 'react';
import Chart from './Chart';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Measurements} from '../../api/measurements';

class ChartContainer extends Component {

  static propTypes = {
    days: PropTypes.number,
    gaugeId: PropTypes.string.isRequired,
    measurements: PropTypes.array,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    days: 1,
  };

  render() {
    const {days, measurements} = this.props;
    return (
      <Chart data={measurements} days={days}/>
    );
  }

}

export default createContainer(
  (props) => {
    const sub = Meteor.subscribe('measurements.forGauge', props.gaugeId, props.days);
    const measurements = Measurements.find({gaugeId: props.gaugeId}).fetch();
    return {
      ready: sub.ready(),
      measurements: measurements || [],
    };
  },
  ChartContainer
);
