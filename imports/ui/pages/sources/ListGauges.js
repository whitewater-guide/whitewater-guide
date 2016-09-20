import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { createContainer } from 'meteor/react-meteor-data';
import { Gauges, removeGauge } from '../../../api/gauges';

class ListGauges extends Component {

  static propTypes = {
    source: PropTypes.object,
  };

  state = {
    dialogOpen: false,
  };

  render() {
    const gauges = this.props.source.gauges();
    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Code</TableHeaderColumn>
              <TableHeaderColumn>URL</TableHeaderColumn>
              <TableHeaderColumn>Coordinate</TableHeaderColumn>
              <TableHeaderColumn>Measures</TableHeaderColumn>
              <TableHeaderColumn>Last value</TableHeaderColumn>
              <TableHeaderColumn>Last timestamp</TableHeaderColumn>
              <TableHeaderColumn>Request params</TableHeaderColumn>
              <TableHeaderColumn>Controls</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { gauges.map(this.renderRow) }
          </TableBody>
        </Table>
        
        <FloatingActionButton style={styles.addButton} onTouchTap={() => this.setState({dialogOpen: true})}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }

  renderRow = (src) => {
    const viewHandler = () => this.props.router.push(`/gauges/${src._id}`);
    const deleteHandler = () => this.removeGauge(src._id);
    return (
      <TableRow key={src._id}>
        <TableRowColumn>{src.disabled}</TableRowColumn>
        <TableRowColumn>{src.name}</TableRowColumn>
        <TableRowColumn>{src.code}</TableRowColumn>
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        <TableRowColumn>{`${src.latitude} ${src.logngitude} (${src.altitude})`}</TableRowColumn>
        <TableRowColumn>{`${src.measurement} (${src.unit})`}</TableRowColumn>
        <TableRowColumn>{src.lastValue}</TableRowColumn>
        <TableRowColumn>{src.lastTimestamp}</TableRowColumn>
        <TableRowColumn>{src.requestParams}</TableRowColumn>
        <TableRowColumn>
          <IconButton iconClassName="material-icons" onTouchTap={viewHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
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
}

const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  addButton: {
    right: 20,
    bottom: 20,
    position: 'absolute',
  },
};

export default ListGauges;