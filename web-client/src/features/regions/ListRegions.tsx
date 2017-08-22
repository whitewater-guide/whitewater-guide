import PropTypes from 'prop-types';
import React, { Component } from "react";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from "material-ui/Table";
import container from './ListRegionsContainer';

class ListRegions extends Component {

  static propTypes = {
    regions: PropTypes.array,
    admin: PropTypes.bool,
    removeRegion: PropTypes.func,
    createRegion: PropTypes.func,
    history: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    newRegionName: '',
  };

  render() {
    return (
      <div style={styles.container}>
        <Table selectable={false} onCellClick={this.onCellClick}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              {this.props.admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true} showRowHover={true}>
            { this.props.regions.map(this.renderRow) }
          </TableBody>
          {
            this.props.admin &&
            <TableFooter adjustForCheckbox={false}>
              { this.renderNewRegionRow() }
            </TableFooter>
          }
        </Table>
      </div>
    );
  }

  renderRow = (region) => {
    return (
      <TableRow key={region._id}>
        <TableRowColumn>{region.name}</TableRowColumn>
        { this.renderAdminControls(region) }
      </TableRow>
    );
  };

  renderAdminControls = (region) => {
    const {admin, removeRegion} = this.props;
    if (!admin)
      return null;
    const deleteHandler = () => removeRegion(region._id);
    const editHandler = () => this.props.history.push(`/regions/${region._id}/settings`);
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
    const {history, regions} = this.props;
    if (rowId >= regions.length)
      return;
    history.push(`/regions/${regions[rowId]._id}`);
  };

  renderNewRegionRow = () => {
    const {baseTheme} = this.context.muiTheme;
    const footerStyle = {...styles.footer, borderBottomColor: baseTheme.palette.borderColor};
    return (
      <TableRow key="_new_region" style={footerStyle}>
        <TableRowColumn>
          <TextField
            fullWidth={true}
            hintText="New Region Name"
            value={this.state.newRegionName}
            onChange={(e, v) => this.setState({ newRegionName: v })}
          />
        </TableRowColumn>
        <TableRowColumn>
          <IconButton iconClassName="material-icons" onTouchTap={this.addNewRegion}>add_circle</IconButton>
        </TableRowColumn>
      </TableRow>
    );
  };

  addNewRegion = () => {
    const {history, createRegion} = this.props;
    createRegion(this.state.newRegionName)
      .then(newRegion => {
        history.push(`/regions/${newRegion._id}`)
      });
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
  footer: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
};

export default container(ListRegions);