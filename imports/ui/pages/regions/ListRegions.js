import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Meteor } from 'meteor/meteor';
import { Regions, createRegion, removeRegion } from '../../../api/regions';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { createContainer } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import withAdmin from '../../hoc/withAdmin';

class ListRegions extends Component {

  static propTypes = {
    regions: PropTypes.array,
    admin: PropTypes.bool,
    ready: PropTypes.bool,
    router: PropTypes.object,
  };

  state = {
    newRegionName: '',
  };

  render() {
    return (
      <div style={styles.container}>
        <Paper style={styles.listPaper}>
          <Table selectable={false} onCellClick={this.onCellClick}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                {this.props.admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              { this.props.regions.map(this.renderRow) }
            </TableBody>
          </Table>
        </Paper>
        { this.renderCreateForm() }
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
    const {admin} = this.props;
    if (!admin)
      return null;
    const deleteHandler = () => removeRegion.call({ regionId: region._id });
    return (
      <TableRowColumn>
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); } }>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  renderCreateForm = () => {
    if (!this.props.admin)
      return;
    return (
      <Paper style={styles.createPaper}>
        <TextField hintText="New Region Name" floatingLabelText="New Region Name"
          value={this.state.newRegionName} onChange={(e, v) => this.setState({ newRegionName: v })} />
        <RaisedButton label="Add" primary={true} style={styles.newRegionName} onTouchTap={this.addNewRegion}/>
      </Paper>
    );
  };

  addNewRegion = () => {
    createRegion.call({ name: this.state.newRegionName });
    this.setState({ newRegionName: '' });
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPaper: {
    marginTop: 16,
    marginBottom: 16,
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

const ListRegionsContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('regions.list');
    const regions = Regions.find().fetch();
    return {
      ready: sub.ready(), 
      regions,
    };
  },
  ListRegions
);

export default withRouter(withAdmin(ListRegionsContainer));