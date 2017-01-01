import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ImageUploadRow from './ImageUploadRow';
import IconButton from 'material-ui/IconButton';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Images, deleteImage} from '../../../api/files';
import _ from 'lodash';
import adminOnly from "../../hoc/adminOnly";

class ManageFiles extends Component {

  static propTypes = {
    ready: PropTypes.bool,
    images: PropTypes.array,
  };

  render() {
    const {ready, images} = this.props;
    if (!ready)
      return null;

    return (
      <div style={styles.container}>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Uploaded at</TableHeaderColumn>
              <TableHeaderColumn>Controls</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={true}>
            { images.map(this.renderRow) }
            <ImageUploadRow key="newImage" onFileSelected={this.onFileSelected}/>
          </TableBody>
        </Table>
      </div>
    );
  }

  renderRow = (file) => {
    return (
      <TableRow key={file._id}>
        <TableRowColumn>{file.name}</TableRowColumn>
        <TableRowColumn>{file.meta.description}</TableRowColumn>
        <TableRowColumn>{file.updatedAt}</TableRowColumn>
        { this.renderControls(file) }
      </TableRow>
    );
  };

  renderControls = (file) => {
    const deleteHandler = () => deleteImage.call({imageId: file._id});
    return (
      <TableRowColumn>
        <div onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        } }>
          <IconButton iconClassName="material-icons" style={styles.iconWrapper} onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  onFileSelected = (file) => {
    Images.insert({file});
  };

}

const styles = {
  container: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    minHeight: 200,
  },
};

const ManageFilesContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('images.all');
    const images = Images.find().fetch();
    return {
      ready: sub.ready(),
      images,
    };
  },
  ManageFiles
);

export default adminOnly(ManageFilesContainer);