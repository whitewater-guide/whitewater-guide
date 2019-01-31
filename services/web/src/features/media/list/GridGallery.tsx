import React from 'react';
import { Styles } from '../../../styles';
import { FileWithPreview } from '../../../utils';
import { Media, MediaKind } from '@whitewater-guide/commons';
import Dropzone from './Dropzone';
import NoMedia from './NoMedia';
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
  onAdd?: (kind: MediaKind, file?: FileWithPreview) => void;
  onEdit?: (media: Media) => void;
  onRemove?: (media: Media) => void;
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
        onEdit={this.props.onEdit}
        onRemove={this.props.onRemove}
      />
    );
  };

  render() {
    const { editable, kind, media, onAdd } = this.props;
    return (
      <div style={styles.gallery}>
        {media.length ? media.map(this.renderThumb) : <NoMedia kind={kind} />}
        {editable && <Dropzone kind={kind} onAdd={onAdd} />}
      </div>
    );
  }
}

export default GridGallery;