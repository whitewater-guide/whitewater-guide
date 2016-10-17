import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Jobs } from '../../../api/jobs';
import { Gauges } from '../../../api/gauges';
import _ from 'lodash';
import withAdmin from '../../hoc/withAdmin';
import moment from 'moment';

class SourceSchedule extends Component {
  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    jobs: PropTypes.array,
    gauges: PropTypes.array,
  };

  render() {
    const {ready, admin} = this.props;
    if (!ready || !admin)
      return null;
    console.log('Jobs', this.props.jobs);
    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
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
    const gauge = _.find(this.props.gauges, { _id: job.data.gauge });
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

const SourceScheduleContainer = createContainer(
  (props) => {
    console.log('Subscribe', props.params.sourceId);
    const jobsSubscription = Meteor.subscribe('jobs.forSource', props.params.sourceId);
    const gaugesSubscription = Meteor.subscribe('gauges.inSource', props.params.sourceId);
    const jobs = Jobs.find(
      { "data.source": props.params.sourceId },
      { fields: { data: 1, status: 1, updated: 1, after: 1, result: 1 } }
    ).fetch();
    const gauges = Gauges.find({ "source": props.params.sourceId }, {fields: {name: 1}}).fetch();
    return {
      ready: jobsSubscription.ready() && gaugesSubscription.ready(),
      gauges,
      jobs
    };
  },
  SourceSchedule
);

export default withAdmin(SourceScheduleContainer);