import * as React from 'react';
import { Styles } from '../../../styles';
import { Media, MediaKind } from '../../../ww-commons';
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
  onAdd?: (kind: MediaKind, file?: File) => void;
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
    const { editable, kind, media, onAdd } = this.props;
    return (
      <div style={styles.gallery}>
        {media.map(this.renderThumb)}
        {editable && <Dropzone kind={kind} onAdd={onAdd} />}
      </div>
    );
  }
}

export default GridGallery;
