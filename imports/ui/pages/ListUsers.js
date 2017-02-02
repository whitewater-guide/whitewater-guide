import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Toggle from 'material-ui/Toggle';
import _ from 'lodash';
import listUsersContainer from './ListUsersContainer';

class ListUsers extends Component {
  static propTypes = {
    users: PropTypes.array,
    toggleAdmin: PropTypes.func,
  };

  render() {
    return (
      <div style={styles.container}>
        <Table selectable={false} onCellClick={this.onCellClick}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>E-mail</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Roles</TableHeaderColumn>
              <TableHeaderColumn>Is admin</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true} showRowHover={true}>
            { this.props.users.map(this.renderRow) }
          </TableBody>
        </Table>
      </div>

    );
  }

  renderRow = (user) => {
    const isAdmin = user.roles.includes('admin');
    const onToggle = () => this.props.toggleAdmin(user._id, !isAdmin);
    const name = _.get(user, 'profile.name', '');
    const link = _.get(user, 'profile.link', '');
    return (
      <TableRow key={user._id}>
        <TableRowColumn>{user._id}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
        <TableRowColumn><a href={link}>{name}</a></TableRowColumn>
        <TableRowColumn>{user.roles.join(', ')}</TableRowColumn>
        <TableRowColumn>
          <Toggle toggled={isAdmin} onToggle={onToggle}/>
        </TableRowColumn>
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
    justifyContent: 'flex-start',
  },
};

export default listUsersContainer(ListUsers);