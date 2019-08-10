import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import { Media, MediaKind } from '@whitewater-guide/commons';
import { History } from 'history';
import groupBy from 'lodash/groupBy';
import React from 'react';
import { ConfirmationDialog, Lightbox } from '../../../components';
import { Row } from '../../../layout/details';
import { FileWithPreview } from '../../../utils';
import BlogsList from './BlogsList';
import GridGallery from './GridGallery';

interface State {
  currentModal: number | null;
  photo: Media[];
  video: Media[];
  blog: Media[];
  photoAndVideo: Media[];
  pendingRemoval: Media | null;
}

interface Props {
  sectionId: string;
  regionId: string;
  media: Media[];
  editable: boolean;
  history: History;
  onRemove: (id: string) => void;
}

class MediaList extends React.PureComponent<Props, State> {
  state: State = {
    currentModal: null,
    photo: [],
    video: [],
    blog: [],
    photoAndVideo: [],
    pendingRemoval: null,
  };

  componentDidMount() {
    this.groupMedia(this.props.media);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.media !== nextProps.media) {
      this.groupMedia(nextProps.media);
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
    const { regionId, sectionId, history } = this.props;
    history.push(
      `/regions/${regionId}/sections/${sectionId}/media/new?kind=${kind}`,
      { file },
    );
  };

  onAddBlog = () => this.onAdd(MediaKind.blog);

  onEdit = (media: Media) => {
    const { regionId, sectionId, history } = this.props;
    const { id } = media;
    history.push(
      `/regions/${regionId}/sections/${sectionId}/media/${id}/settings`,
    );
  };

  onRemove = (media: Media) => this.setState({ pendingRemoval: media });

  onCancelRemove = () => this.setState({ pendingRemoval: null });

  onConfirmRemove = () => {
    if (this.state.pendingRemoval) {
      this.props.onRemove(this.state.pendingRemoval.id);
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
    const { editable } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Grid item={true}>
            <h2>Photos</h2>
          </Grid>
        </Row>
        <Row>
          <Grid item={true} sm={12}>
            <GridGallery
              editable={editable}
              kind={MediaKind.photo}
              media={photo}
              onThumbClick={this.onPhotoClick}
              onAdd={this.onAdd}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          </Grid>
        </Row>
        <Row>
          <Grid item={true}>
            <h2>Videos</h2>
          </Grid>
        </Row>
        <Row>
          <Grid item={true} sm={12}>
            <GridGallery
              editable={editable}
              kind={MediaKind.video}
              media={video}
              onThumbClick={this.onVideoClick}
              onAdd={this.onAdd}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          </Grid>
        </Row>
        <Row>
          <Grid item={true}>
            <h2>
              {'Blogs'}
              {editable && (
                <Button onClick={this.onAddBlog}>
                  <Icon>add</Icon>
                  Add
                </Button>
              )}
            </h2>
          </Grid>
        </Row>
        <Row>
          <Grid item={true} xs={6}>
            <BlogsList
              editable={editable}
              media={blog}
              onEdit={this.onEdit}
              onRemove={this.onRemove}
            />
          </Grid>
        </Row>
        <Lightbox
          items={photoAndVideo}
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
