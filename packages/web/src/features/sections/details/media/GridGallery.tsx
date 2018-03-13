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
}

class GridGallery extends React.PureComponent<Props> {
  renderThumb = (photo: Media, index: number) => {
    return (
      <Thumb index={index} media={photo} />
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
