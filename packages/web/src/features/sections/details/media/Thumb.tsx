import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import * as React from 'react';
import injectSheet from 'react-jss';
import { getVideoThumb } from '../../../../ww-clients/utils';
import { Media, MediaKind } from '../../../../ww-commons';
import { THUMB_HEIGHT } from './constants';

const styles = {
  container: {
    position: 'relative',
    marginRight: 16,
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
    opacity: 0,
    '&:hover': {
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  },
};

interface Props {
  index: number;
  media: Media;
  editable?: boolean;
  onEdit?: (media: Media) => void;
  onClick?: (media: Media, index: number) => void;
  classes?: any;
}

interface State {
  thumb?: string;
  width?: number;
  height?: number;
}

class Thumb extends React.PureComponent<Props, State> {
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
    let thumb: string | undefined;
    const height = THUMB_HEIGHT;
    let width = THUMB_HEIGHT;
    if (kind === MediaKind.photo) {
      thumb = media.thumb;
      if (media.resolution && media.resolution.length === 2) {
        const scale = THUMB_HEIGHT / media.resolution[1];
        width = media.resolution[0] * scale;
      }
      this.setState({ thumb: media.thumb, width, height });
    } else if (kind === MediaKind.video) {
      const videoThumb = await getVideoThumb(url, THUMB_HEIGHT);
      if (videoThumb) {
        const scale = THUMB_HEIGHT / videoThumb.height;
        width = videoThumb.width * scale;
        this.setState({ thumb: videoThumb.thumb, height, width });
      }
    }
  };

  onClick = () => {
    const { index, media, onClick } = this.props;
    if (onClick) {
      onClick(media, index);
    }
  };

  onEdit = () => {
    const { media, onEdit } = this.props;
    if (onEdit) {
      onEdit(media);
    }
  };

  render() {
    const { classes, editable } = this.props;
    const { thumb = '', width = THUMB_HEIGHT, height = THUMB_HEIGHT } = this.state || {};
    return (
      <div className={classes.container} onClick={this.onClick}>
        <img src={thumb} style={{ width, height }} />
        <div className={classes.overlay} style={{ width, height }}>
          {
            editable &&
            (
              <IconButton onClick={this.onEdit}>
                <FontIcon className="material-icons" color="white">edit</FontIcon>
              </IconButton>
            )
          }
        </div>
      </div>
    );
  }
}

const StyledThumb: React.ComponentType<Props> = injectSheet(styles)(Thumb);
export default StyledThumb;
