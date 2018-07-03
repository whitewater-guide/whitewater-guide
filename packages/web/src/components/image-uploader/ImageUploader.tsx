import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import { Styles } from '../../styles';
import { getImageSize } from '../../utils';
import { uploadFile } from '../../ww-clients/utils';
import { Media, MediaKind, UploadLink } from '../../ww-commons';
import { DeleteButton } from '../DeleteButton';
import { Lightbox } from '../lightbox';
import AddFile from './AddFile';

const styles: Styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    width: 'max-content',
    padding: 8,
  },
  main: {
    display: 'flex',
    padding: 8,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderStyle: 'solid',
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    minHeight: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'scale-down',
    cursor: 'pointer',
  },
  noImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderStyle: 'dashed',
    backgroundColor: 'white',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#f44336',
  },
};

interface Props {
  bucket: string;
  width: number;
  height: number;
  previewScale: number;
  value: string | File | null;
  title: string;
  onChange: (value: string | File | null) => void;
  uploading?: boolean; // for storybook
  upload?: UploadLink; // optional for storybook
}

interface State {
  badSize: boolean;
  uploading: boolean;
  currentModal: number | null;
  fakeMedia: Media[];
}

const getSrc = (value: string, bucket: string) => {
  if (process.env.STORYBOOK_ENABLED === 'true') {
    return value;
  }
  return `${process.env.REACT_APP_API_HOST}/uploads/${bucket}/${value}`;
};

const getFakeMedia = (props: Props): Media[] => {
  const { value, bucket, width, height } = props;
  return (typeof value === 'string') ? [{
    id: 'upload',
    url: value,
    description: value,
    copyright: '',
    kind: MediaKind.photo,
    resolution: [width, height],
    weight: 0,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  }] : [];
};

export class ImageUploader extends React.PureComponent<Props, State> {

  static getDerivedStateFromProps(props: Props, prevState: State) {
    return {
      ...prevState,
      fakeMedia: getFakeMedia(props),
    };
  }

  readonly state: State = {
    badSize: false,
    uploading: this.props.uploading || false,
    currentModal: null,
    fakeMedia: getFakeMedia(this.props),
  };

  async componentDidMount() {
    if (this.props.value instanceof File) {
      const badSize = await this.checkFileSize(this.props.value);
      this.setState({ badSize });
    }
  }

  checkFileSize = async (file: File) => {
    const { width, height } = this.props;
    const dimensions = await getImageSize(file);
    return dimensions.width !== width || dimensions.height !== height;
  };

  onAdd = async (file: File) => {
    const badSize = await this.checkFileSize(file);
    this.setState({ badSize });
    this.props.onChange(file);
    if (!badSize && this.props.upload) {
      this.setState({ uploading: true });
      const filename = await uploadFile(file, this.props.upload, file.name);
      this.props.onChange(filename);
      this.setState({ uploading: false });
    }
  };

  onDelete = () => this.props.onChange(null);

  onCloseLightbox = () => this.setState({ currentModal: null });

  onOpenLightbox = () => {
    if (this.props.value instanceof File) {
      return;
    }
    this.setState({ currentModal: 0 });
  };

  renderImage = () => {
    const { bucket, width, height, previewScale, value } = this.props;
    const { uploading } = this.state;
    const imageStyle = {
      width: width * previewScale,
      height: height * previewScale,
    };
    if (uploading) {
      return (
        <div style={{ ...imageStyle, ...styles.noImage }}>
          <CircularProgress />
        </div>
      );
    }
    if (value) {
      const src: string = (value instanceof File) ? (value as any).preview : getSrc(value, bucket);
      return (
        <div style={imageStyle}>
          <img style={styles.image} src={src} onClick={this.onOpenLightbox} />
        </div>
      );
    }
    return (
      <div style={{ ...imageStyle, ...styles.noImage }}>
        <span>No Image</span>
      </div>
    );
  };

  renderFilename = () => {
    const { width, height, value } = this.props;
    const { badSize } = this.state;
    if (badSize) {
      return (
        <span style={styles.error}>
          {`Required image size is ${width}x${height}`}
        </span>
      );
    }
    const filename = (value instanceof File) ? value.name : value;
    return (
      <span>
        {`File: ${filename || ''}`}
      </span>
    );
  };

  render() {
    const { title } = this.props;
    return (
      <div style={styles.root}>
        <span><strong>{title}</strong></span>
        {this.renderFilename()}
        <div style={styles.main}>
          <div style={styles.imageWrapper}>
            {this.renderImage()}
          </div>
          <div style={styles.buttons}>
            <DeleteButton id="img" deleteHandler={this.onDelete} />
            <AddFile onAdd={this.onAdd} />
          </div>
        </div>
        <Lightbox media={this.state.fakeMedia} currentModal={this.state.currentModal} onClose={this.onCloseLightbox} />
      </div>
    );
  }
}
