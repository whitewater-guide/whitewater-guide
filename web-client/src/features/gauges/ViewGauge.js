import React, {Component, PropTypes} from 'react';
import {InteractiveChart} from '../../core/components';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import _ from 'lodash';
import container from './ViewGaugeContainer';

class ViewGauge extends Component {
  static propTypes = {
    gauge: PropTypes.object,
    loading: PropTypes.bool,
    onDomainChanged: PropTypes.func,
    startDate: PropTypes.instanceOf(Date),//initial value
    endDate: PropTypes.instanceOf(Date),//initial value
  };

  render() {
    const {loading, gauge, onDomainChanged, startDate, endDate} = this.props;
    if (loading && !gauge)
      return null;
    const {name, measurements, lastLevel, lastFlow, levelUnit, flowUnit, lastTimestamp} = gauge;
    return (
      <div style={styles.container}>
        <div style={styles.body}>
          <Paper style={styles.headerPaper}>
            <h1>{name}</h1>
            <p>{`Last measured level: ${_.round(lastLevel, 4)} ${levelUnit} from ${moment(lastTimestamp).format('DD/MM/YYYY HH:mm')}`}</p>
            <p>{`Last measured flow: ${_.round(lastFlow, 4)} ${flowUnit} from ${moment(lastTimestamp).format('DD/MM/YYYY HH:mm')}`}</p>
          </Paper>
          <Paper style={styles.chartHolder}>
            <InteractiveChart data={measurements} onDomainChanged={onDomainChanged} startDate={startDate}
                              endDate={endDate}/>
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

export default container(ViewGauge);