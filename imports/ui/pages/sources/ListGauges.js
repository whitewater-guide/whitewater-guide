import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges, removeGauge } from '../../../api/gauges';
import { autofill } from '../../../api/sources';
import {Link} from 'react-router';

class ListGauges extends Component {

  static propTypes = {
    source: PropTypes.object,
    gauges: PropTypes.array,
  };

  render() {
    const newGaugeLink = this.props.source ? `/sources/${this.props.source._id}/gauges/new` : '';
    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn style={styles.columns.status}></TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Code</TableHeaderColumn>
              <TableHeaderColumn>URL</TableHeaderColumn>
              <TableHeaderColumn>Coordinate</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.controls}>Controls</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { this.props.gauges.map(this.renderRow) }
          </TableBody>
        </Table>

        { this.props.gauges.length === 0 && <RaisedButton label="Autofill" fullWidth={true} onTouchTap={this.autofill} />}
        
        <Link to={newGaugeLink}> 
          <FloatingActionButton style={styles.addButton}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
      </div>
    );
  }

  renderRow = (src) => {
    const viewHandler = () => this.props.router.push(`/gauges/${src._id}`);
    const deleteHandler = () => this.removeGauge(src._id);
    const statusIconStyle = {...styles.statusIcon, color: src.disabled ? 'red' : 'green'};
    const lat = src.latitude ? src.latitude.toFixed(4) : '?';
    const lon = src.longitude ? src.longitude.toFixed(4) : '?';
    const alt = src.altitude ? ` (${src.altitude.toFixed()})` : '';
    return (
      <TableRow key={src._id}>
        <TableRowColumn style={styles.columns.status}>
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} iconStyle={statusIconStyle}>fiber_manual_record</IconButton>
        </TableRowColumn>
        <TableRowColumn>{src.name}</TableRowColumn>
        <TableRowColumn>{src.code}</TableRowColumn>
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        <TableRowColumn>{`${lat} ${lon}${alt}`}</TableRowColumn>
        <TableRowColumn style={styles.columns.controls}>
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={viewHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
        </TableRowColumn>
      </TableRow>
    );
  };

  removeGauge = (gaugeId) => {
    //TODO: show dialog
    removeGauge.callPromise({gaugeId})
      .then( () => console.log('Sources deleted'))
      .catch( err => console.log('Error while deleting source', err));
  };

  autofill = () => {
    autofill.callPromise({sourceId: this.props.source._id})
      .then( result => console.log(`Autofill result: ${result}`))
      .catch( error => console.log(`Autofill error: ${error}`));
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
  addButton: {
    right: 20,
    bottom: 20,
    position: 'absolute',
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
      width: 60,
    }
  },
};

const ListGaugesContainer = createContainer(
  (props) => {
    const gauges = props.source ? props.source.gauges().fetch() : [];
    return { gauges };
  },
  ListGauges
);

export default ListGaugesContainer;