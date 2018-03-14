import { groupBy } from 'lodash';
import * as React from 'react';
import { Col } from 'react-grid-system';
import { Container, Row } from '../../../../layout/details';
import { Media } from '../../../../ww-commons';
import { MediaKind } from '../../../../ww-commons/features/media';
import { WithMediaList } from './conatiner';
import GridGallery from './GridGallery';
import Lightbox from './Lightbox';

interface State {
  currentModal: number | null;
  photo: Media[];
  video: Media[];
  blog: Media[];
  photoAndVideo: Media[];
}

class SectionMedia extends React.PureComponent<WithMediaList, State> {
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

  componentWillReceiveProps(nextProps: WithMediaList) {
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

  render() {
    const {
      currentModal,
      photo,
      video,
      blog,
      photoAndVideo,
    } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h2>Photos</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <GridGallery editable kind={MediaKind.photo} media={photo} onThumbClick={this.onPhotoClick}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Videos</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <GridGallery editable kind={MediaKind.video} media={video} onThumbClick={this.onVideoClick} />
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
      </Container>
    );
  };

}

export default SectionMedia;
