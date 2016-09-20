import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { createContainer } from 'meteor/react-meteor-data';
import {withRouter} from 'react-router';
import { Sources } from '../../../api/sources';
import {removeSource} from '../../../api/sources';
import NewSource from './NewSource';

class ListGauges extends Component {

  static propTypes = {
    sources: PropTypes.array,
    router: PropTypes.object,
  };

  state = {
    dialogOpen: false,
  };

  render() {
    return (
      <div style={styles.container}>
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
        
        <FloatingActionButton style={styles.addButton} onTouchTap={() => this.setState({dialogOpen: true})}>
          <ContentAdd />
        </FloatingActionButton>

        <NewSource onClose={() => this.setState({dialogOpen: false})} open={this.state.dialogOpen}/>
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
        <TableRowColumn>{src.code}</TableRowColumn>
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
  },
  addButton: {
    right: 20,
    bottom: 20,
    position: 'absolute',
  },
};

const ListGaugesContainer = createContainer(
  () => {
    const sources = Sources.find({}).fetch();
    return { sources };
  },
  ListGauges
);

export default withRouter(ListGaugesContainer);