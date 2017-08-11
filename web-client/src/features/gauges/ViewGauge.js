import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import * as moment from 'moment';
import { compose } from 'recompose';
import _ from 'lodash';
import { InteractiveChart, spinnerWhileLoading } from '../../core/components';
import { withGauge } from '../../commons/features/gauges';

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

class ViewGauge extends Component {
  static propTypes = {
    gauge: PropTypes.object.isRequired,
    onDomainChanged: PropTypes.func,
    startDate: PropTypes.instanceOf(Date).isRequired, // initial value
    endDate: PropTypes.instanceOf(Date).isRequired, // initial value
  };

  renderLastMeasurement = (name, value, unit, timestamp) =>
    `Last measured ${name}: ${_.round(value, 4)} ${unit} from ${moment(timestamp).format('DD/MM/YYYY HH:mm')}`;

  render() {
    const { gauge, onDomainChanged, startDate, endDate } = this.props;
    const { name, measurements, lastLevel, lastFlow, levelUnit, flowUnit, lastTimestamp } = gauge;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h1>{name}</h1>
            <p>{this.renderLastMeasurement('level', lastLevel, levelUnit, lastTimestamp)}</p>
            <p>{this.renderLastMeasurement('flow', lastFlow, flowUnit, lastTimestamp)}</p>
          </Paper>
          <Paper style={styles.chartHolder}>
            <InteractiveChart
              data={measurements}
              onDomainChanged={onDomainChanged}
              startDate={startDate}
              endDate={endDate}
            />
          </Paper>
        </div>
      </div>
    );
  }

}

export default compose(
  withGauge({ withMeasurements: true }),
  spinnerWhileLoading(props => props.gaugeLoading),
)(ViewGauge);
