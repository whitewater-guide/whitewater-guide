import type { MediaKind } from '@whitewater-guide/schema';
import React from 'react';

import type { Styles } from '../../../../styles';
import type { LocalPhoto } from '../../../../utils/files';
import Dropzone from './Dropzone';
import NoMedia from './NoMedia';
import Thumb from './thumb';
import type { ListedMedia } from './types';

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
  media: ListedMedia[];
  onThumbClick?: (media: ListedMedia, index: number) => void;
  onAdd?: (kind: MediaKind, photo?: LocalPhoto) => void;
  onEdit?: (media: ListedMedia) => void;
  onRemove?: (media: ListedMedia) => void;
}

class GridGallery extends React.PureComponent<Props> {
  renderThumb = (photo: ListedMedia, index: number) => (
    <Thumb
      editable={this.props.editable}
      key={photo.id || photo.url || `photo${index}`}
      index={index}
      media={photo}
      onClick={this.props.onThumbClick}
      onEdit={this.props.onEdit}
      onRemove={this.props.onRemove}
    />
  );

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
