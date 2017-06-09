import PropTypes from 'prop-types';
import React from 'react';
import Lightbox from 'react-image-lightbox';
import IconButton from 'material-ui/IconButton';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  previewHolder: {
    position: 'relative',
    width: 64,
    height: 64,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  iconInner: {
    color: 'white',
  },
  img: {
    position: 'relative',
    top: 0,
    left: 0,
    width: 64,
    height: 64,
  },
};

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '';

export default class MediaPreviewButton extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      description: PropTypes.string,
      copyright: PropTypes.string,
      deleted: PropTypes.boolean,
    }).isRequired,
  };

  state = {
    open: false,
  };

  onPreview = () => this.setState({ open: true });
  onClosePreview = () => this.setState({ open: false });

  render() {
    const { url, file } = this.props.value;
    let src = url;
    let thumb = url;
    if (src && src.indexOf('http') !== 0) {
      src = `${BASE_URL}/images/${url}`;
      thumb = `${BASE_URL}/thumbs/64/${url}`;
    }
    if (!src) {
      src = file.preview;
      thumb = file.preview;
    }
    return (
      <div style={styles.container}>
        <div style={styles.previewHolder}>
          <IconButton style={styles.icon} iconClassName="material-icons" iconStyle={styles.iconInner} onTouchTap={this.onPreview}>
            remove_red_eye
          </IconButton>
          <img src={thumb} style={styles.img} width={64} height={64} />
        </div>
        {
          this.state.open &&
          <Lightbox mainSrc={src} onCloseRequest={this.onClosePreview} />
        }
      </div>
    );
  }
}
