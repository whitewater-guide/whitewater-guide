import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {Meteor} from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {withRouter} from 'react-router';
import { Sources } from '../../../api/sources';
import {removeSource} from '../../../api/sources';

class ListSources extends Component {

  static propTypes = {
    sources: PropTypes.array,
    ready: PropTypes.bool,
    router: PropTypes.object,
  };

  render() {
    return (
      <div style={styles.container}>
        <Paper style={styles.paper}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>URL</TableHeaderColumn>
                <TableHeaderColumn>Script ID</TableHeaderColumn>
                <TableHeaderColumn>Harvest type</TableHeaderColumn>
                <TableHeaderColumn>Harvest interval</TableHeaderColumn>
                <TableHeaderColumn>Controls</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              { this.props.sources.map(this.renderRow) }
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  renderRow = (src) => {
    const viewHandler = () => this.props.router.push(`/sources/${src._id}`);
    const deleteHandler = () => this.removeSource(src._id);
    return (
      <TableRow key={src._id}>
        <TableRowColumn>{src.name}</TableRowColumn>
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        <TableRowColumn>{src.script}</TableRowColumn>
        <TableRowColumn>{src.harvestMode}</TableRowColumn>
        <TableRowColumn>{src.interval}</TableRowColumn>
        <TableRowColumn>
          <IconButton iconClassName="material-icons" onTouchTap={viewHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </TableRowColumn>
      </TableRow>
    );
  };

  removeSource = (sourceId) => {
    //TODO: show dialog
    removeSource.callPromise({sourceId})
      .then( () => console.log('Sources deleted'))
      .catch( err => console.log('Error while deleting source', err));
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
  addButton: {
    right: 20,
    bottom: 20,
    position: 'absolute',
  },
};

const ListSourcesContainer = createContainer(
  () => {
    const sourcesSubscription = Meteor.subscribe('sources.list');
    const sources = Sources.find().fetch();
    return {
      ready: sourcesSubscription.ready(), 
      sources 
    };
  },
  ListSources
);

export default withRouter(ListSourcesContainer);