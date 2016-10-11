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
    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Source/Script</TableHeaderColumn>
              <TableHeaderColumn>Gauge</TableHeaderColumn>
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Updated</TableHeaderColumn>
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
        <TableRowColumn>{moment(job.created).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
        <TableRowColumn>{moment(job.updated).format('DD/MM/YYYY HH:mm')}</TableRowColumn>
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  paper: {
    flex: 1,
    maxWidth: 1000,
    marginTop: 80,
    marginBottom: 80,
    paddingBottom: 80,
    position: 'relative',
  },
};

const SourceScheduleContainer = createContainer(
  (props) => {
    console.log('Subscribe', props.params.sourceId);
    const jobsSubscription = Meteor.subscribe('jobs.forSource', props.params.sourceId);
    const gaugesSubscription = Meteor.subscribe('gauges.inSource', props.params.sourceId);
    const jobs = Jobs.find({ "data.source": props.params.sourceId }).fetch();
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