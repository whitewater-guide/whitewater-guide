import React, {PropTypes} from 'react';
import Lightbox from 'react-image-lightbox';
import IconButton from 'material-ui/IconButton';

export default class MediaPreviewButton extends React.Component {
  static propTypes = {
    value: PropTypes.object,
  };

  state = {
    open: false,
  };

  render() {
    const {value} = this.props;
    let src = value.url;
    if (src && src.indexOf('http') !== 0)
      src = (process.env.NODE_ENV === 'development' ? 'http://localhost:3333/images/' : '/images/') + src;
    if (!src)
      src = value.file.preview;
    return (
      <div style={styles.previewHolder}>
        <IconButton iconClassName="material-icons" onTouchTap={this.onPreview}>
          remove_red_eye
        </IconButton>
        {
          this.state.open &&
          <Lightbox
            mainSrc={src}
            onCloseRequest={() => this.setState({open: false})}
          />
        }
      </div>

    );
  }

  onPreview = () => {
    this.setState({open: true});
  };
}

const styles = {
  previewHolder: {
    width: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};