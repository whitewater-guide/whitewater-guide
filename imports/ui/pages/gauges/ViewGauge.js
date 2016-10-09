import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges } from '../../../api/gauges';
import Chart from '../../components/Chart';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import _ from 'lodash';

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
    const {lastValue, lastTimestamp} = this.props.gauge;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h1>{this.props.gauge.name}</h1>
            <span>{`Last value: ${_.round(lastValue,2 )} from ${moment(lastTimestamp).format('DD/MM/YYYY HH:mm')}`}</span>
          </Paper>
          <Paper style={styles.chartHolder}>
            <Chart data={this.props.measurements}/>
          </Paper>
        </div>
      </div>
    );
  }

}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  headerPaper: {
    margin: 16,
    padding: 8,
  },
  chartHolder: {
    display: 'flex',
    flex: 1,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
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