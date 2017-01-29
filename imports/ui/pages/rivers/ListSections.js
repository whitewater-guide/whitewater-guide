import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import {removeSection} from '../../../api/sections';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import withAdmin from '../../hoc/withAdmin';
import {withRouter} from "react-router";
import {renderDifficulty} from '../../../utils/TextUtils';
import Rating from '../../forms/Rating';

class ListSections extends Component {

  static propTypes = {
    river: PropTypes.object,//Document
    admin: PropTypes.bool,
    style: PropTypes.object,
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: props.river.sections().fetch()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.river !== nextProps.river) {
      this.refreshSections();
    }
  }

  render() {
    return (
      <Table style={this.props.style} selectable={false} onCellClick={this.onCellClick}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Difficulty</TableHeaderColumn>
            <TableHeaderColumn>Rating</TableHeaderColumn>
            <TableHeaderColumn>Length</TableHeaderColumn>
            {this.props.admin && <TableHeaderColumn>Controls</TableHeaderColumn>}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={true}>
          { this.state.sections && this.state.sections.map(this.renderRow) }
        </TableBody>
      </Table>
    );
  }

  renderRow = (section) => {

    const ratingField = {value: section.rating};
    return (
      <TableRow key={section._id}>
        <TableRowColumn>{section.name}</TableRowColumn>
        <TableRowColumn>{renderDifficulty(section)}</TableRowColumn>
        <TableRowColumn><Rating field={ratingField} style={styles.rating}/></TableRowColumn>
        <TableRowColumn>{section.distance}</TableRowColumn>
        { this.renderAdminControls(section) }
      </TableRow>
    );
  };

  renderAdminControls = (section) => {
    const {admin, router} = this.props;
    if (!admin)
      return null;
    const editHandler = () => router.push(`/sections/${section._id}/settings`);
    const deleteHandler = () => this.deleteSection(section._id);
    return (
      <TableRowColumn>
        <div onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        } }>
          <IconButton iconClassName="material-icons" onTouchTap={editHandler}>mode_edit</IconButton>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  refreshSections = () => {
    this.setState({sections: this.props.river.sections().fetch()});
  };

  deleteSection = (sectionId) => {
    removeSection.callPromise({sectionId})
      .then(() => this.refreshSections())
      .catch(error => console.error(`Unable to delete section: ${error}`));
  };

  onCellClick = (rowId) => {
    this.props.router.push(`/sections/${this.state.sections[rowId]._id}`);
  };

}

const styles = {
  rating: {
    alignItems: 'flex-start',
  },
};

export default withRouter(withAdmin(ListSections));