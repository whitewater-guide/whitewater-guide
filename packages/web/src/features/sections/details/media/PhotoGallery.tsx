import * as React from 'react';
import Gallery, { GalleryImage } from 'react-grid-gallery';
import { Media } from '../../../../ww-commons';

interface Props {
  photos: Media[];
}

const mapper = (input: Media): GalleryImage => {
  let width = 128;
  const height = 128;
  if (input.resolution && input.resolution.length === 2) {
    const scale = 128 / input.resolution[1];
    width = input.resolution[0] * scale;
  }
  return {
    src: input.url,
    thumbnail: input.thumb!,
    thumbnailWidth: width,
    thumbnailHeight: height,
  };
};

class PhotoGallery extends React.PureComponent<Props> {

  render() {
    const { photos } = this.props;
    return (
      <Gallery enableImageSelection={false} images={photos.map(mapper)} />
    );
  }
}

export default PhotoGallery;
