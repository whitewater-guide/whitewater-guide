import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { removeSection } from '../../../api/sections';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from "react-router";

class ListSections extends Component {

  static propTypes = {
    sections: PropTypes.array,
    admin: PropTypes.bool,
    style: PropTypes.object,
    router: PropTypes.object,
  };

  render() {
    return (
      <Table style={this.props.style} selectable={false} onCellClick={this.onCellClick}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Difficulty</TableHeaderColumn>
            <TableHeaderColumn>Length</TableHeaderColumn>
            {this.props.admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true}>
          { this.props.sections && this.props.sections.map(this.renderRow) }
        </TableBody>
      </Table>
    );
  }

  renderRow = (section) => {
    return (
      <TableRow key={section._id}>
        <TableRowColumn>{section.name}</TableRowColumn>
        <TableRowColumn>{section.difficulty}</TableRowColumn>
        <TableRowColumn>{section.length}</TableRowColumn>
        { this.renderAdminControls(section) }
      </TableRow>
    );
  };

  renderAdminControls = (section) => {
    const {admin, router} = this.props;
    if (!admin)
      return null;
    const editHandler = () => router.push(`/sections/${section._id}/settings`);
    const deleteHandler = () => removeSection.call({ sectionId: section._id });
    return (
      <TableRowColumn>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); } }>
          <IconButton iconClassName="material-icons" onTouchTap={editHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  onCellClick = (rowId) => {
    const {router, sections} = this.props;
    router.push(`/sections/${sections[rowId]._id}`);
  };

}

export default withRouter(withAdmin(ListSections));