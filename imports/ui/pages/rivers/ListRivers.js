import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { Meteor } from 'meteor/meteor';
import { Rivers, removeRiver } from '../../../api/rivers';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { createContainer } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import withAdmin from '../../hoc/withAdmin';

class ListRivers extends Component {

  static propTypes = {
    rivers: PropTypes.array,
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    router: PropTypes.object,
  };

  render() {
    return (
      <div style={styles.container}>
        <Table selectable={false} onCellClick={this.onCellClick}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Region</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              {this.props.admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { this.props.ready && this.props.rivers.map(this.renderRow) }
          </TableBody>
        </Table>
      </div>
    );
  }

  renderRow = (river) => {
    return (
      <TableRow key={river._id}>
        <TableRowColumn>{river.name}</TableRowColumn>
        <TableRowColumn>{river.region().name}</TableRowColumn>
        <TableRowColumn>{river.description}</TableRowColumn>
        { this.renderAdminControls(river) }
      </TableRow>
    );
  };

  renderAdminControls = (river) => {
    const {admin} = this.props;
    if (!admin)
      return null;
    const deleteHandler = () => removeRiver.call({ riverId: river._id });
    return (
      <TableRowColumn>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); } }>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  createPaper: {
    marginBottom: 16,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
  },
  createButton: {
    marginLeft: 16,
  },
};

const ListRiversContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('rivers.list');
    const rivers = Rivers.find().fetch();
    return {
      ready: sub.ready(),
      rivers,
    };
  },
  ListRivers
);

export default withRouter(withAdmin(ListRiversContainer));