import * as React from 'react';
import { Styles } from '../../../../styles';
import { Media } from '../../../../ww-commons';
import Thumb from './Thumb';

const styles: Styles = {
  gallery: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

interface Props {
  media: Media[];
  onThumbClick?: (media: Media, index: number) => void;
}

class GridGallery extends React.PureComponent<Props> {
  renderThumb = (photo: Media, index: number) => {
    return (
      <Thumb key={photo.id} index={index} media={photo} onClick={this.props.onThumbClick} />
    );
  };

  render() {
    const { media } = this.props;
    return (
      <div style={styles.gallery}>
        {media.map(this.renderThumb)}
      </div>
    );
  }
}

export default GridGallery;
