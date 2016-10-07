import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges } from '../../../api/gauges';
import Chart from '../../components/Chart';
import { Meteor } from 'meteor/meteor';

class ViewGauge extends Component {
  static propTypes = {
    params: PropTypes.shape({
      gaugeId: PropTypes.string,
    }),
    gauge: PropTypes.object,
    measurements: PropTypes.array,
  };

  render() {
    if (!this.props.ready)
      return null;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <h1>{this.props.gauge.name}</h1>
          <div style={styles.chartHolder}>
            <Chart data={this.props.measurements}/>
          </div>
        </div>
        <div style={styles.rightColumn}>
          List of rivers?
        </div>  
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  rightColumn: {
    display: 'flex',
    width: 200,
    flexDirection: 'column',
  },
  chartHolder: {
    display: 'flex',
    flex: 1,
    padding: 16,
  },
}

const ViewGaugeContainer = createContainer(
  (props) => {
    const gaugeSubscription = Meteor.subscribe('gauges.details', props.params.gaugeId);
    const gauge = Gauges.findOne(props.params.gaugeId);
    return {
      ready: gaugeSubscription.ready(),
      gauge,
      measurements: gauge ? gauge.measurements().fetch() : [],
    };
  },
  ViewGauge
);

export default ViewGaugeContainer;