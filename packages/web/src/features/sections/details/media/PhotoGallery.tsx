import * as React from 'react';
import Gallery, { GalleryImage } from 'react-grid-gallery';
import { Media } from '../../../../ww-commons';
import { THUMB_HEIGHT } from './constants';

interface Props {
  photos: Media[];
}

const mapper = (input: Media): GalleryImage => {
  let width = THUMB_HEIGHT;
  const height = THUMB_HEIGHT;
  if (input.resolution && input.resolution.length === 2) {
    const scale = THUMB_HEIGHT / input.resolution[1];
    width = input.resolution[0] * scale;
  }
  return {
    src: input.url,
    thumbnail: input.thumb!,
    thumbnailWidth: width,
    thumbnailHeight: height,
  };
};

// TODO: wait for react-grid-gallery to use react-images v1, then unify lightboxes for photo and video
class PhotoGallery extends React.PureComponent<Props> {

  render() {
    const { photos } = this.props;
    return (
      <Gallery enableImageSelection={false} images={photos.map(mapper)} />
    );
  }
}

export default PhotoGallery;
