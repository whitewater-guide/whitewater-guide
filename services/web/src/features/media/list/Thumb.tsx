import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { getVideoThumb } from '@whitewater-guide/clients';
import { Media, MediaKind } from '@whitewater-guide/commons';
import React from 'react';
import injectSheet from 'react-jss';
import { Styles } from '../../../styles';
import { THUMB_HEIGHT } from './constants';

const styles: Styles = {
  container: {
    position: 'relative',
    marginRight: 16,
    marginBottom: 16,
    height: THUMB_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    color: 'white',
    cursor: 'pointer',
    textAlign: 'right',
    opacity: 0,
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    '& .MuiIcon-root': {
      color: 'white',
    },
  },
  brokenImage: {
    width: THUMB_HEIGHT,
    height: THUMB_HEIGHT,
    boxSizing: 'border-box',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#BBBBBB',
    borderStyle: 'solid',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  brokenImageMenu: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: 48,
  },
  brokenImageBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
  },
};

interface Props {
  index: number;
  media: Media;
  editable?: boolean;
  onEdit?: (media: Media) => void;
  onRemove?: (media: Media) => void;
  onClick?: (media: Media, index: number) => void;
  classes?: any;
}

interface State {
  thumb?: string | null;
  width?: number;
  height?: number;
}

class Thumb extends React.PureComponent<Props, State> {
  state: State = {};

  async componentDidMount() {
    await this.setThumb(this.props.media);
  }

  async componentWillReceiveProps(nextProps: Props) {
    if (this.props.media.id !== nextProps.media.id) {
      await this.setThumb(nextProps.media);
    }
  }

  setThumb = async (media: Media) => {
    const { kind, url } = media;
    if (kind === MediaKind.photo) {
      this.setState({
        thumb: media.thumb,
        height: THUMB_HEIGHT,
      });
    } else if (kind === MediaKind.video) {
      const videoThumb = await getVideoThumb(url, THUMB_HEIGHT);
      if (videoThumb) {
        const scale = THUMB_HEIGHT / videoThumb.height;
        const width = videoThumb.width * scale;
        this.setState({ thumb: videoThumb.thumb, height: THUMB_HEIGHT, width });
      }
    }
  };

  renderImage = () => {
    const { thumb, width, height } = this.state;
    const { classes, editable } = this.props;
    if (!thumb) {
      return null;
    }
    return (
      <React.Fragment>
        <img src={thumb} style={{ width, height }} />
        <div className={classes.overlay} style={{ width, height }}>
          {editable && (
            <React.Fragment>
              <IconButton onClick={this.onEdit}>
                <Icon>edit</Icon>
              </IconButton>
              <IconButton onClick={this.onRemove}>
                <Icon>delete_forever</Icon>
              </IconButton>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  };

  renderBrokenImage = () => {
    const { thumb } = this.state;
    const { media, editable } = this.props;
    if (thumb) {
      return null;
    }
    return (
      <div style={styles.brokenImage}>
        <div style={styles.brokenImageMenu}>
          {editable && (
            <React.Fragment>
              <IconButton onClick={this.onEdit}>
                <Icon color="error">edit</Icon>
              </IconButton>
              <IconButton onClick={this.onRemove}>
                <Icon>delete_forever</Icon>
              </IconButton>
            </React.Fragment>
          )}
        </div>
        <div style={styles.brokenImageBody}>
          <span style={styles.text}>Cannot render thumb</span>
          {!!media.url && (
            <a href={media.url} style={styles.text} target="_blank">
              go see yourself
            </a>
          )}
        </div>
      </div>
    );
  };

  onClick = () => {
    const { index, media, onClick } = this.props;
    if (onClick) {
      onClick(media, index);
    }
  };

  onEdit = (e: React.MouseEvent<{}>) => {
    e.stopPropagation();
    const { media, onEdit } = this.props;
    if (onEdit) {
      onEdit(media);
    }
  };

  onRemove = (e: React.MouseEvent<{}>) => {
    e.stopPropagation();
    const { media, onRemove } = this.props;
    if (onRemove) {
      onRemove(media);
    }
  };

  render() {
    const { classes } = this.props;
    const { thumb } = this.state;
    return (
      <div
        className={classes.container}
        onClick={thumb ? this.onClick : undefined}
      >
        {this.renderImage()}
        {this.renderBrokenImage()}
      </div>
    );
  }
}

const StyledThumb: React.ComponentType<Props> = injectSheet(styles)(Thumb);
export default StyledThumb;
