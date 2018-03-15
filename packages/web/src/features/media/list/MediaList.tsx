import { groupBy } from 'lodash';
import * as React from 'react';
import { Col } from 'react-grid-system';
import { Row } from '../../../layout/details';
import { Media, MediaKind } from '../../../ww-commons';
import GridGallery from './GridGallery';
import Lightbox from './Lightbox';
import { MediaListProps } from './types';

interface State {
  currentModal: number | null;
  photo: Media[];
  video: Media[];
  blog: Media[];
  photoAndVideo: Media[];
}

class MediaList extends React.PureComponent<MediaListProps, State> {
  state: State = {
    currentModal: null,
    photo: [],
    video: [],
    blog: [],
    photoAndVideo: [],
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
    const { photo = [], video = [], blog = [] } = groupBy(media, 'kind');
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

  onAdd = (kind: MediaKind, file?: File) => {
    const { match: { params: { regionId, sectionId } }, history } = this.props;
    history.push(`/regions/${regionId}/sections/${sectionId}/media/new?kind=${kind}`, { file });
  };

  render() {
    const { currentModal, photo, video, blog, photoAndVideo } = this.state;
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
              editable
              kind={MediaKind.photo}
              media={photo}
              onThumbClick={this.onPhotoClick}
              onAdd={this.onAdd}
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
              editable
              kind={MediaKind.video}
              media={video}
              onThumbClick={this.onVideoClick}
              onAdd={this.onAdd}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Blogs</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              {JSON.stringify(blog)}
            </div>
          </Col>
        </Row>
        <Lightbox media={photoAndVideo} currentModal={currentModal} onClose={this.onCloseLightbox}/>
      </React.Fragment>
    );
  }
}

export default MediaList;
