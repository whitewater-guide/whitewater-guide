import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ImageUploadRow from './ImageUploadRow';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Images, deleteImage} from '../../../api/files';
import Lightbox from 'react-image-lightbox';
import adminOnly from "../../hoc/adminOnly";
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

class ManageFiles extends Component {

  static propTypes = {
    ready: PropTypes.bool,
    images: PropTypes.array,
  };

  state = {
    photoIndex: 0,
    lightboxOpen: false,
  };

  render() {
    const {ready, images} = this.props;
    if (!ready)
      return null;

    return (
      <div style={styles.container}>
        <Table selectable={false} onCellClick={this.onCellClick}>
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
          </TableBody>
        </Table>
        <ImageUploadRow onFileSelected={this.onFileSelected}/>
        { this.state.lightboxOpen && this.renderLightbox()}
      </div>
    );
  }

  renderRow = (file, index) => {
    //Images.findOne(file._id).link()
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
    const link = Images.findOne(file._id).link();
    return (
      <TableRowColumn>
        <div onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        } }>
          <CopyToClipboard text={link}>
            <IconButton iconClassName="material-icons">content_copy</IconButton>
          </CopyToClipboard>
          <IconButton iconClassName="material-icons" onTouchTap={deleteHandler}>delete_forever</IconButton>
        </div>
      </TableRowColumn>
    );
  };

  onCellClick = (rowId) => {
    this.setState({
      photoIndex: rowId,
      lightboxOpen: true,
    });
  };

  renderLightbox = () => {
    const {images} = this.props;
    const {photoIndex} = this.state;
    //Images.findOne(file._id).link()
    let sources = {
      mainSrc: _.get(images, [photoIndex, '_id']),
      nextSrc: _.get(images, [(photoIndex + 1) % images.length, '_id']),
      prevSrc: _.get(images, [(photoIndex + images.length - 1) % images.length, '_id']),
    };
    sources = _.mapValues(sources, id => id && Images.findOne(id).link());
    let title = (
      <span>{_.get(images, [photoIndex, 'name'])}</span>
    );
    let description = (
      <span>{_.get(images, [photoIndex, 'meta', 'description'])}</span>
    );
    return (
      <Lightbox
        {...sources}
        onCloseRequest={() => this.setState({ lightboxOpen: false })}
        onMovePrevRequest={() => this.setState({
          photoIndex: (photoIndex + images.length - 1) % images.length,
        })}
        onMoveNextRequest={() => this.setState({
          photoIndex: (photoIndex + 1) % images.length,
        })}
        imageTitle={title}
        imageCaption={description}
      />
    );
  };

  onFileSelected = (file, description) => {
    let settings = {
      file,
      onError: (error, fileData) => console.error(`Error ${error} while uploading ${JSON.stringify(fileData)}`),
    };
    if (description)
      settings.meta = {description};
    Images.insert(settings);
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