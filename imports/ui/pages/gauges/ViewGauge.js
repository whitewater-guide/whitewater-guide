import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges } from '../../../api/gauges';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

class ViewGauge extends Component {
  static propTypes = {
    params: PropTypes.shape({
      gaugeId: PropTypes.string,
    }),
    gauge: PropTypes.object,
  }

  render() {
    if (!this.props.ready)
      return null;
    return (
      <div>
        {this.props.gauge.measurements().map(this.renderMeasurement)}
      </div>
    );
  }

  renderMeasurement = (m) => {
    return (
      <div key={m._id}>
        <span>{moment(m.timestamp).format('DD/MM/YYYY HH:mm')}</span>
        <span>{m.value}</span>
      </div>
    )
  };
}

const ViewGaugeContainer = createContainer(
  (props) => {
    const gaugeSubscription = Meteor.subscribe('gauges.details', props.params.gaugeId);
    const gauge = Gauges.findOne(props.params.gaugeId);
    console.log('Found gauge', gauge);
    return {
      ready: gaugeSubscription.ready(),
      gauge 
    };
  },
  ViewGauge
);

export default ViewGaugeContainer;