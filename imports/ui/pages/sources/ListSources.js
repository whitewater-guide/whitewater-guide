import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {Meteor} from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {withRouter} from 'react-router';
import { Sources } from '../../../api/sources';
import {removeSource} from '../../../api/sources';
import {Roles} from 'meteor/alanning:roles';

class ListSources extends Component {

  static propTypes = {
    sources: PropTypes.array,
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    router: PropTypes.object,
  };

  render() {
    const {ready, admin} = this.props;
    if (!ready)
      return null;
    return (
      <div style={styles.container}>
        <Paper style={styles.paper}>
          <Table selectable={false} onCellClick={this.onCellClick}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>URL</TableHeaderColumn>
                {admin && <TableHeaderColumn>Script ID</TableHeaderColumn>}
                {admin && <TableHeaderColumn>Harvest type</TableHeaderColumn>}
                {admin && <TableHeaderColumn>Harvest interval</TableHeaderColumn>}
                {admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
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
    const {admin} = this.props;
    const viewHandler = () => this.props.router.push(`/sources/${src._id}`);
    const deleteHandler = () => this.removeSource(src._id);
    return (
      <TableRow key={src._id}>
        <TableRowColumn>{src.name}</TableRowColumn>
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        {admin && <TableRowColumn>{src.script}</TableRowColumn>}
        {admin && <TableRowColumn>{src.harvestMode}</TableRowColumn>}
        {admin && <TableRowColumn>{src.interval}</TableRowColumn>}
        {admin && <TableRowColumn>
          <IconButton iconClassName="material-icons" onTouchTap={viewHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </TableRowColumn>
        }
      </TableRow>
    );
  };

  removeSource = (sourceId) => {
    //TODO: show dialog
    removeSource.callPromise({sourceId})
      .then( () => console.log('Sources deleted'))
      .catch( err => console.log('Error while deleting source', err));
  };

  onCellClick = (rowId) => {
    const {router, sources} = this.props;
    router.push(`/sources/${sources[rowId]._id}`);
  }
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

const ListSourcesContainer = createContainer(
  () => {
    const sourcesSubscription = Meteor.subscribe('sources.list');
    const sources = Sources.find().fetch();
    return {
      admin: Roles.userIsInRole(Meteor.userId(), 'admin'),
      ready: sourcesSubscription.ready() && Roles.subscription.ready(), 
      sources 
    };
  },
  ListSources
);

export default withRouter(ListSourcesContainer);