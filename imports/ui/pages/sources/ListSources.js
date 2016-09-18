import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Link} from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Sources } from '../../../api/sources';

class ListSources extends Component {

  static propTypes = {
    sources: PropTypes.array,
  };

  render() {
    return (
      <div>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>URL</TableHeaderColumn>
              <TableHeaderColumn>Script ID</TableHeaderColumn>
              <TableHeaderColumn>Harvest type</TableHeaderColumn>
              <TableHeaderColumn>Harvest interval</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { this.props.sources.map(this.renderRow) }
          </TableBody>
        </Table>
        <Link to="/sources/new">
          <FloatingActionButton style={styles.addButton}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
      </div>
    );
  }

  renderRow = (src) => {
    return (
      <TableRow key={src._id}>
        <TableRowColumn>{src.name}</TableRowColumn>
        <TableRowColumn><a href={src.url}>{src.url}</a></TableRowColumn>
        <TableRowColumn>{src.code}</TableRowColumn>
        <TableRowColumn>{src.harvestMode}</TableRowColumn>
        <TableRowColumn>{src.interval}</TableRowColumn>
      </TableRow>
    );
  };
}

const styles = {
  addButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
};

export default createContainer(
  () => {
    const sources = Sources.find({}).fetch();
    console.log('Found src', sources);
    return { sources };
  },
  ListSources
);

