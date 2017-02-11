import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import _ from 'lodash';
import moment from 'moment';
import container from './SourceScheduleContainer';

class SourceSchedule extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    jobs: PropTypes.array,
    gauges: PropTypes.array,
  };

  render() {
    if (this.props.loading)
      return null;
    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Source/Script</TableHeaderColumn>
              <TableHeaderColumn>Gauge</TableHeaderColumn>
              <TableHeaderColumn>Updated</TableHeaderColumn>
              <TableHeaderColumn>Next run</TableHeaderColumn>
              <TableHeaderColumn>Measurements count</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            {this.props.jobs.map(this.renderRow)}
          </TableBody>
        </Table>
      </div>
    );
  }

  renderRow = (job) => {
    const gauge = _.find(this.props.gauges, {_id: job.data.gaugeId});
    const numMeasurements = job.result ? job.result.measurements : '--';
    return (
      <TableRow key={job._id}>
        <TableRowColumn>{job.status}</TableRowColumn>
        <TableRowColumn>{job.data.script}</TableRowColumn>
        <TableRowColumn>{gauge ? gauge.name : '--'}</TableRowColumn>
        <TableRowColumn>{moment(job.updated).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
        <TableRowColumn>{moment(job.after).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
        <TableRowColumn>{numMeasurements}</TableRowColumn>
      </TableRow>
    );
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
};

export default container(SourceSchedule);