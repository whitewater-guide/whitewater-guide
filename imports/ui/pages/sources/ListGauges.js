import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles'
import { withRouter } from 'react-router';
import { Gauges, removeGauge, setEnabled } from '../../../api/gauges';
import { Sources } from '../../../api/sources';
import moment from 'moment';

class ListGauges extends Component {

  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    source: PropTypes.object,
    gauges: PropTypes.array,
    router: PropTypes.object,
  };

  render() {
    const {ready, admin, gauges} = this.props;
    if (!ready)
      return null;
    
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
    const editHandler = () => this.props.router.push(`/gauges/${src._id}/settings`);
    const deleteHandler = () => this.removeGauge(src._id);
    const startStopHandler = () => this.setGaugeEnabled(src._id, !src.enabled);
    
    const statusIconStyle = {...styles.statusIcon, color: (admin && src.isRunning()) ? 'green' : 'red'};
    // const statusIconStyle = {...styles.statusIcon, color: 'red' };
    const lat = src.latitude ? src.latitude.toFixed(4) : '?';
    const lon = src.longitude ? src.longitude.toFixed(4) : '?';
    const alt = src.altitude ? ` (${src.altitude.toFixed()})` : '';
    return (
      <TableRow key={src._id}>
        {admin &&
          <TableRowColumn style={styles.columns.status}>
            <IconButton iconClassName="material-icons" style={styles.iconWrapper} iconStyle={statusIconStyle}>fiber_manual_record</IconButton>
          </TableRowColumn>
        }
        <TableRowColumn>{src.name}</TableRowColumn>
        {admin && <TableRowColumn>{src.code}</TableRowColumn>}
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        <TableRowColumn>{`${lat} ${lon}${alt}`}</TableRowColumn>
        <TableRowColumn>{src.lastValue}</TableRowColumn>
        <TableRowColumn>{moment(src.lastTimestamp).format('DD.MM.YYYY HH:mm')}</TableRowColumn>
        {admin && <TableRowColumn>{src.cron}</TableRowColumn>}
        { admin &&
          <TableRowColumn style={styles.columns.controls}>
            {this.props.source.harvestMode === 'oneByOne' && <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={startStopHandler}>{src.enabled ? 'stop' : 'play_arrow'}</IconButton>}
            <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={editHandler}>mode_edit</IconButton>
            <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
          </TableRowColumn>
        }
      </TableRow>
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
    const gaugesSubscription = Meteor.subscribe('gauges.inSource', props.params.sourceId);
    const gauges = Gauges.find({ source: props.params.sourceId }).fetch();
    const source = Sources.findOne(props.params.sourceId);
    return {
      admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
      ready: gaugesSubscription.ready() && Roles.subscription.ready(),
      source,
      gauges 
    };
  },
  ListGauges
);

export default withRouter(ListGaugesContainer);