import * as React from 'react';
import { Styles } from '../../../styles/index';
import { Media, MediaKind } from '../../../ww-commons/index';
import Dropzone from './Dropzone';
import Thumb from './Thumb';

const styles: Styles = {
  gallery: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

interface Props {
  editable?: boolean;
  kind: MediaKind;
  media: Media[];
  onThumbClick?: (media: Media, index: number) => void;
}

class GridGallery extends React.PureComponent<Props> {
  renderThumb = (photo: Media, index: number) => {
    return (
      <Thumb
        editable={this.props.editable}
        key={photo.id}
        index={index}
        media={photo}
        onClick={this.props.onThumbClick}
      />
    );
  };

  render() {
    const { editable, kind, media } = this.props;
    return (
      <div style={styles.gallery}>
        {media.map(this.renderThumb)}
        {editable && <Dropzone kind={kind} />}
      </div>
    );
  }
}

export default GridGallery;
