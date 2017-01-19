import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges } from '../../../api/gauges';
import InteractiveChart from '../../components/InteractiveChart';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import _ from 'lodash';
import { TAPi18n } from 'meteor/tap:i18n';

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
    const {lastLevel, lastFlow, levelUnit, flowUnit, lastTimestamp} = this.props.gauge;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h1>{this.props.gauge.name}</h1>
            <p>{`Last measured level: ${_.round(lastLevel,2 )}${levelUnit} from ${moment(lastTimestamp).format('DD/MM/YYYY HH:mm')}`}</p>
            <p>{`Last measured flow: ${_.round(lastFlow,2 )}${flowUnit} from ${moment(lastTimestamp).format('DD/MM/YYYY HH:mm')}`}</p>
          </Paper>
          <Paper style={styles.chartHolder}>
            <InteractiveChart gaugeId={this.props.params.gaugeId}/>
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
};

const ViewGaugeContainer = createContainer(
  (props) => {
    const gaugeSubscription = TAPi18n.subscribe('gauges.details', null, props.params.gaugeId);
    const gauge = Gauges.findOne(props.params.gaugeId);
    return {
      ready: gaugeSubscription.ready(),
      gauge,
    };
  },
  ViewGauge
);

export default ViewGaugeContainer;