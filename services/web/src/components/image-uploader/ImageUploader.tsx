import CircularProgress from '@material-ui/core/CircularProgress';
import { uploadFile } from '@whitewater-guide/clients';
import { Media, MediaKind, UploadLink } from '@whitewater-guide/commons';
import React from 'react';
import { S3_HOST } from '../../environment';
import { Styles } from '../../styles';
import {
  cleanupPreview,
  FileWithPreview,
  getImageSize,
  isFileWithPreview,
} from '../../utils';
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

export interface ImageUploaderProps {
  bucket: string;
  width: number | [number, number];
  height: number | [number, number];
  previewScale: number;
  title?: string;
  hideFileName?: boolean;
  value: string | FileWithPreview | null;
  onChange: (value: string | FileWithPreview | null) => void;
  uploading?: boolean; // for storybook
  upload?: UploadLink; // optional for storybook
  rootStyle?: any;
  mainStyle?: any;
}

interface State {
  badSize: boolean;
  uploading: boolean;
  currentModal: number | null;
  fakeMedia: Media[];
  useTempBucket: boolean;
}

const getSrc = (value: string, bucket: string) => {
  if (process.env.STORYBOOK_ENABLED === 'true') {
    return value;
  }
  return value.startsWith('http') ? value : `${S3_HOST}/${bucket}/${value}`;
};

const getFakeMedia = (
  props: ImageUploaderProps,
  useTempBucket?: boolean,
): Media[] => {
  const { value, bucket } = props;
  return typeof value === 'string'
    ? [
        {
          id: 'upload',
          // lightbox is will render relative urls from  to media bucket, but can render absolute urls
          url: getSrc(value, useTempBucket ? 'temp' : bucket),
          image: getSrc(value, useTempBucket ? 'temp' : bucket),
          description: value,
          copyright: '',
          kind: MediaKind.photo,
          resolution: [1000, 1000], // it's fake - doesn't matter for lightbox
          weight: 0,
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString(),
          size: 12345678,
        },
      ]
    : [];
};

export class ImageUploader extends React.PureComponent<
  ImageUploaderProps,
  State
> {
  static getDerivedStateFromProps(props: ImageUploaderProps, prevState: State) {
    return {
      ...prevState,
      fakeMedia: getFakeMedia(props, prevState.useTempBucket),
    };
  }

  readonly state: State = {
    badSize: false,
    uploading: this.props.uploading || false,
    currentModal: null,
    fakeMedia: getFakeMedia(this.props),
    useTempBucket: false,
  };

  async componentDidMount() {
    if (isFileWithPreview(this.props.value)) {
      const badSize = await this.checkFileSize(this.props.value);
      this.setState({ badSize });
    }
  }

  componentDidUpdate(prevProps: ImageUploaderProps) {
    if (
      isFileWithPreview(prevProps.value) &&
      prevProps.value !== this.props.value
    ) {
      cleanupPreview(prevProps.value);
    }
  }

  checkFileSize = async (file: FileWithPreview) => {
    const { width, height } = this.props;
    const dimensions = await getImageSize(file);
    const [minWidth, maxWidth] =
      typeof width === 'number' ? [width, width] : width;
    const [minHeight, maxHeight] =
      typeof height === 'number' ? [height, height] : height;
    return !(
      dimensions.width >= minWidth &&
      dimensions.width <= maxWidth &&
      dimensions.height >= minHeight &&
      dimensions.height <= maxHeight
    );
  };

  onAdd = async (file: FileWithPreview) => {
    const badSize = await this.checkFileSize(file);
    this.setState({ badSize });
    this.props.onChange(file);
    if (!badSize && this.props.upload) {
      this.setState({ uploading: true });
      const filename = await uploadFile(file.file, this.props.upload);
      this.props.onChange(filename);
      this.setState({ uploading: false, useTempBucket: true });
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
    const { uploading, useTempBucket } = this.state;
    const imageStyle = {
      width: (typeof width === 'number' ? width : width[1]) * previewScale,
      height: (typeof height === 'number' ? height : height[1]) * previewScale,
    };
    if (uploading) {
      return (
        <div style={{ ...imageStyle, ...styles.noImage }}>
          <CircularProgress />
        </div>
      );
    }
    if (value) {
      const src: string = isFileWithPreview(value)
        ? value.preview
        : getSrc(value, useTempBucket ? 'temp' : bucket);
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
    const { value } = this.props;
    const filename = value instanceof File ? value.name : value;
    return <span>{`File: ${filename || ''}`}</span>;
  };

  renderBadSize = () => {
    const { width, height } = this.props;
    const { badSize } = this.state;
    if (badSize) {
      return (
        <span style={styles.error}>
          {`Required image size is ${width}x${height}`}
        </span>
      );
    }
  };

  render() {
    const { hideFileName, title, rootStyle, mainStyle } = this.props;
    return (
      <div style={{ ...styles.root, ...rootStyle }}>
        {!!title && (
          <span>
            <strong>{title}</strong>
          </span>
        )}
        {!hideFileName && this.renderFilename()}
        <div style={{ ...styles.main, ...mainStyle }}>
          <div style={styles.imageWrapper}>{this.renderImage()}</div>
          <div style={styles.buttons}>
            <DeleteButton id="img" deleteHandler={this.onDelete} />
            <AddFile onAdd={this.onAdd} />
          </div>
        </div>
        {this.renderBadSize()}
        <Lightbox
          media={this.state.fakeMedia}
          currentModal={this.state.currentModal}
          onClose={this.onCloseLightbox}
        />
      </div>
    );
  }
}
