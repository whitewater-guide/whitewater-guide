import { Media, MediaKind } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import { Col } from 'react-grid-system';
import { ConfirmationDialog, Lightbox } from '../../../components';
import { Row } from '../../../layout/details';
import { FileWithPreview } from '../../../utils';
import BlogsList from './BlogsList';
import GridGallery from './GridGallery';
import { MediaListProps } from './types';

interface State {
  currentModal: number | null;
  photo: Media[];
  video: Media[];
  blog: Media[];
  photoAndVideo: Media[];
  pendingRemoval: Media | null;
}

class MediaList extends React.PureComponent<MediaListProps, State> {
  state: State = {
    currentModal: null,
    photo: [],
    video: [],
    blog: [],
    photoAndVideo: [],
    pendingRemoval: null,
  };

  componentDidMount() {
    this.groupMedia(this.props.mediaBySection.nodes);
  }

  componentWillReceiveProps(nextProps: MediaListProps) {
    if (this.props.mediaBySection !== nextProps.mediaBySection) {
      this.groupMedia(nextProps.mediaBySection.nodes);
    }
  }

  groupMedia = (media: Media[]) => {
    const existingMedia = media.filter((m) => !m.deleted);
    const { photo = [], video = [], blog = [] } = groupBy(
      existingMedia,
      'kind',
    );
    const photoAndVideo = [...photo, ...video];
    this.setState({ photo, video, blog, photoAndVideo });
  };

  onPhotoClick = (media: Media, index: number) => {
    this.setState({ currentModal: index });
  };

  onVideoClick = (media: Media, index: number) => {
    this.setState({ currentModal: this.state.photo.length + index });
  };

  onCloseLightbox = () => {
    this.setState({ currentModal: null });
  };

  onAdd = (kind: MediaKind, file?: FileWithPreview) => {
    const {
      match: {
        params: { regionId, sectionId },
      },
      history,
    } = this.props;
    history.push(
      `/regions/${regionId}/sections/${sectionId}/media/new?kind=${kind}`,
      { file },
    );
  };

  onAddBlog = () => this.onAdd(MediaKind.blog);

  onEdit = (media: Media) => {
    const {
      match: {
        params: { regionId, sectionId },
      },
      history,
    } = this.props;
    const { id } = media;
    history.push(
      `/regions/${regionId}/sections/${sectionId}/media/${id}/settings`,
    );
  };

  onRemove = (media: Media) => this.setState({ pendingRemoval: media });

  onCancelRemove = () => this.setState({ pendingRemoval: null });

  onConfirmRemove = () => {
    if (this.state.pendingRemoval) {
      this.props.removeMedia(this.state.pendingRemoval.id);
      this.setState({ pendingRemoval: null });
    }
  };

  render() {
    const {
      currentModal,
      photo,
      video,
      blog,
      photoAndVideo,
      pendingRemoval,
    } = this.state;
    const {
      region: { node },
    } = this.props;
    const editable = node ? node.editable : false;
    return (
      <React.Fragment>
        <Row>
          <Col>
            <h2>Photos</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <GridGallery
              editable={editable}
              kind={MediaKind.photo}
              media={photo}
              onThumbClick={this.onPhotoClick}
              onAdd={this.onAdd}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Videos</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <GridGallery
              editable={editable}
              kind={MediaKind.video}
              media={video}
              onThumbClick={this.onVideoClick}
              onAdd={this.onAdd}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>
              {'Blogs'}
              {editable && (
                <FlatButton
                  onClick={this.onAddBlog}
                  label="Add"
                  icon={<FontIcon className="material-icons">add</FontIcon>}
                />
              )}
            </h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <BlogsList
                editable={editable}
                media={blog}
                onEdit={this.onEdit}
                onRemove={this.onRemove}
              />
            </div>
          </Col>
        </Row>
        <Lightbox
          media={photoAndVideo}
          currentModal={currentModal}
          onClose={this.onCloseLightbox}
        />
        {!!pendingRemoval && (
          <ConfirmationDialog
            title="Delete media?"
            description="Are you sure to delete this media?"
            onCancel={this.onCancelRemove}
            onConfirm={this.onConfirmRemove}
          />
        )}
      </React.Fragment>
    );
  }
}

export default MediaList;
