import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Lightbox from 'react-image-lightbox';
import {withAdmin} from "../users";
import Dropzone from 'react-dropzone';
import CopyToClipboard from 'react-copy-to-clipboard';

import _ from 'lodash';

class ManageFiles extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    images: PropTypes.array,
  };

  static defaultProps = {
    loading: false,
    images: [],
  };

  state = {
    photoIndex: 0,
    lightboxOpen: false,
  };

  render() {
    const {loading, images} = this.props;

    if (loading)
      return null;

    return (
      <div style={styles.container}>

        <Dropzone onDrop={this.onDrop}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>

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
        { this.state.lightboxOpen && this.renderLightbox() }
      </div>
    );
  }

  renderRow = (file) => {
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

  renderControls = () => {
    //const deleteHandler = () => deleteImage.call({imageId: file._id});
    //const link = Images.findOne(file._id).link();
    return (
      <TableRowColumn>
        <div onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        } }>
          <CopyToClipboard text={'aaaa'}>
            <IconButton iconClassName="material-icons">content_copy</IconButton>
          </CopyToClipboard>
          <IconButton iconClassName="material-icons">delete_forever</IconButton>
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
    sources =[];// _.mapValues(sources, id => id && Images.findOne(id).link());
    let title = (
      <span>{_.get(images, [photoIndex, 'name'])}</span>
    );
    let description = (
      <span>{_.get(images, [photoIndex, 'meta', 'description'])}</span>
    );
    return (
      <Lightbox
        {...sources}
        onCloseRequest={() => this.setState({lightboxOpen: false})}
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

  onDrop = (files) => {
    console.log('Received files: ', files);
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

export default withAdmin()(ManageFiles);