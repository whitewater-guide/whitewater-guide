import { compact } from 'lodash';
import * as React from 'react';
import Gallery, { GalleryImage } from 'react-grid-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import getVideoThumb from '../../../../ww-clients/utils/getVideoThumb';
import { Media } from '../../../../ww-commons';
import { THUMB_HEIGHT } from './constants';

const mapper = async (input: Media): Promise<GalleryImage | null> => {
  const thumb = await getVideoThumb(input.url, 1);
  if (!thumb) {
    return null;
  }
  const height = THUMB_HEIGHT;
  const scale = Math.min(1, THUMB_HEIGHT / thumb.height);
  const width = thumb.width * scale;
  return {
    src: input.url,
    thumbnail: thumb.url,
    thumbnailWidth: width,
    thumbnailHeight: height,
  };
};

interface Props {
  videos: Media[];
}

interface State {
  currentModal: number | null;
  thumbs: GalleryImage[];
}

class VideoGallery extends React.PureComponent<Props, State> {
  state: State = { currentModal: null, thumbs: [] };

  componentDidMount() {
    this.loadThumbs(this.props.videos);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.videos !== nextProps.videos) {
      this.loadThumbs(nextProps.videos);
    }
  }

  loadThumbs = async (videos: Media[]) => {
    try {
      const thumbs = await Promise.all(videos.map(mapper));
      this.setState({ thumbs: compact(thumbs) });
    } catch {/*Ignore*/}
  };

  toggleModal = (index: number | null = null) => {
    this.setState({ currentModal: index });
  };

  render() {
    const { videos } = this.props;
    const { currentModal, thumbs } = this.state;
    return (
      <React.Fragment>
        <Gallery enableImageSelection={false} images={thumbs} />
        <ModalGateway>
          {
            currentModal !== null &&
            <Modal allowFullscreen={false} closeOnBackdropClick={false} onClose={this.toggleModal}>
              <Carousel
                currentIndex={currentModal}
                components={{ Footer: null, View: null }}
                frameProps={{ autoSize: 'height' }}
                views={videos}
              />
            </Modal>
          }
        </ModalGateway>
      </React.Fragment>
    );
  }
}

export default VideoGallery;
