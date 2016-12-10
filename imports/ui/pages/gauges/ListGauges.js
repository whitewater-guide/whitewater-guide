import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import { Gauges, removeGauge, setEnabled } from '../../../api/gauges';
import { Sources } from '../../../api/sources';
import { ActiveJobsReport } from '../../../api/jobs/client';
import moment from 'moment';
import _ from 'lodash';
import withAdmin from "../../hoc/withAdmin";

class ListGauges extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    source: PropTypes.object,
    gauges: PropTypes.array,
    router: PropTypes.object,
    jobsReport: PropTypes.array,
    location: PropTypes.object,
  };

  render() {
    const {ready, admin, gauges} = this.props;
    if (!ready)
      return null;
    if (!this.props.location.query.sourceId)
      return (<div>Please specify source</div>);

    return (
      <div style={styles.container}>
        <Table selectable={false} onCellClick={this.onCellClick}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              {admin && <TableHeaderColumn style={styles.columns.status}></TableHeaderColumn>}
              <TableHeaderColumn>Name</TableHeaderColumn>
              {admin && <TableHeaderColumn>Code</TableHeaderColumn>}
              <TableHeaderColumn>URL</TableHeaderColumn>
              <TableHeaderColumn>Coordinate</TableHeaderColumn>
              <TableHeaderColumn>Value</TableHeaderColumn>
              <TableHeaderColumn>Date</TableHeaderColumn>
              {admin && <TableHeaderColumn>Cron</TableHeaderColumn>}
              {admin && <TableHeaderColumn style={styles.columns.controls}>Controls</TableHeaderColumn>}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { gauges.map(this.renderRow) }
          </TableBody>
        </Table>
      </div>
    );
  }

  renderRow = (src) => {
    const {admin} = this.props;
    let location = '';
    if (src.location) {
      let {altitude, coordinates: [longitude, latitude]} = src.location;
      const lat = latitude ? latitude.toFixed(4) : '?';
      const lon = longitude ? longitude.toFixed(4) : '?';
      const alt = altitude ? ` (${altitude.toFixed()})` : '(?)';
      location = `${lat} ${lon}${alt}`;
    }
    return (
      <TableRow key={src._id}>
        { this.renderStatusIndicator(src) }
        <TableRowColumn>{src.name}</TableRowColumn>
        {admin && <TableRowColumn>{src.code}</TableRowColumn>}
        <TableRowColumn><a href={src.url}>Link</a></TableRowColumn>
        <TableRowColumn>{location}</TableRowColumn>
        <TableRowColumn>{src.lastValue}</TableRowColumn>
        <TableRowColumn>{moment(src.lastTimestamp).format('DD.MM.YYYY HH:mm')}</TableRowColumn>
        {admin && <TableRowColumn>{src.cron}</TableRowColumn>}
        { this.renderAdminControls(src) }
      </TableRow>
    );
  };

  renderStatusIndicator = (gauge) => {
    const {admin, jobsReport} = this.props;
    if (!admin)
      return null;
    const hasJobs = _.find(jobsReport, j => j._id === gauge._id && j.count > 0);
    const statusIconStyle = {...styles.statusIcon, color: hasJobs ? 'green' : 'red'};
    // const statusIconStyle = {...styles.statusIcon, color: 'red' };
    return (
      <TableRowColumn style={styles.columns.status}>
        <IconButton iconClassName="material-icons" style={styles.iconWrapper} iconStyle={statusIconStyle}>fiber_manual_record</IconButton>
      </TableRowColumn>
    );
  };

  renderAdminControls = (gauge) => {
    const {admin} = this.props;
    if (!admin)
      return null;
    const editHandler = () => this.props.router.push(`/gauges/${gauge._id}/settings`);
    const deleteHandler = () => this.removeGauge(gauge._id);
    const startStopHandler = () => this.setGaugeEnabled(gauge._id, !gauge.enabled);
    return (
      <TableRowColumn style={styles.columns.controls}>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); } }>
          {this.props.source.harvestMode === 'oneByOne' && <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={startStopHandler}>{gauge.enabled ? 'stop' : 'play_arrow'}</IconButton>}
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={editHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  removeGauge = (gaugeId) => {
    //TODO: show dialog
    removeGauge.callPromise({gaugeId})
      .then( () => console.log('Gauge deleted'))
      .catch( err => console.log('Error while deleting gauge', err));
  };
    
  setGaugeEnabled = (gaugeId, enabled) => {
    setEnabled.callPromise({ gaugeId, enabled })
      .then(() => console.log('Gauges enable toggled'))
      .catch(err => console.log('Error while toggling gauge', err));
  };

  onCellClick = (rowId) => {
    const {router, gauges} = this.props;
    router.push(`/gauges/${gauges[rowId]._id}`);
  };

}

const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    minHeight: 200,
  },
  statusIcon: {
    fontSize: 16,
  },
  iconWrapper: {
    paddingLeft: 2,
    paddingRight: 2,
    width: 'auto',
  },
  columns: {
    status: {
      width: 20,
      paddingLeft: 0,
      paddingRight: 0,
    },
    controls: {
      paddingRight: 0,
      width: 90,
    }
  },
};

const ListGaugesContainer = createContainer(
  (props) => {
    const sourceId = props.location.query.sourceId;
    const gaugesSub = Meteor.subscribe('gauges.inSource', sourceId);
    const gauges = Gauges.find({ sourceId }).fetch();
    const source = Sources.findOne(sourceId);
    const reportSub = Meteor.subscribe('jobs.activeReport', sourceId);
    const jobsReport = ActiveJobsReport.find().fetch();
    return {
      ready: gaugesSub.ready() && reportSub.ready(),
      source,
      gauges,
      jobsReport,
    };
  },
  ListGauges
);

export default withAdmin(withRouter(ListGaugesContainer));