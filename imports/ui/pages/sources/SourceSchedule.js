import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {Meteor} from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Jobs } from '../../../api/jobs';
import withAdmin from '../../hoc/withAdmin';

class SourceSchedule extends Component {
  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    jobs: PropTypes.array,
  };
  
  render() {
    const {ready, admin} = this.props;
    if (!ready || !admin)
      return null;
    return (
      <div style={styles.container}>
        <Paper style={styles.paper}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Gauge</TableHeaderColumn>
                <TableHeaderColumn>Created</TableHeaderColumn>
                <TableHeaderColumn>Updated</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              { this.props.jobs.map(this.renderRow) }
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  renderRow = (job) => {
    return (
      <TableRow key={job._id}>
        <TableRowColumn>{job.status}</TableRowColumn>
        <TableRowColumn>{job.gauge}</TableRowColumn>
        <TableRowColumn>{job.created}</TableRowColumn>
        <TableRowColumn>{job.updated}</TableRowColumn>
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
    const jobs = Jobs.find({"data.source": props.params.sourceId}).fetch();
    return {
      ready: jobsSubscription.ready(),
      jobs 
    };
  },
  SourceSchedule
);

export default withAdmin(SourceScheduleContainer);