import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_STRING,
  MediaKind,
  MIN_FILE_SIZE,
  MIN_FILE_SIZE_STRING,
} from '@whitewater-guide/commons';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import Dz from 'react-dropzone';
import { Styles } from '../../../styles';
import { FileWithPreview, withPreview } from '../../../utils';
import { THUMB_HEIGHT } from './constants';

const styles: Styles = {
  dz: {
    width: THUMB_HEIGHT,
    height: THUMB_HEIGHT,
    boxSizing: 'border-box',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: '#333333',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  icon: {
    fontSize: 64,
  },
  error: {
    color: 'red',
  },
};

interface Props {
  kind: MediaKind;
  onAdd?: (kind: MediaKind, file?: FileWithPreview) => void;
}

interface State {
  error: string | null;
}

class Dropzone extends React.PureComponent<Props, State> {
  readonly state: State = { error: null };

  onClick = () => {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.kind);
    }
  };

  onDrop = (acceptedFiles: File[]) => {
    if (this.props.onAdd) {
      const file = acceptedFiles[0];
      if (file.size <= MIN_FILE_SIZE || file.size >= MAX_FILE_SIZE) {
        this.setState({
          error: `Min ${MIN_FILE_SIZE_STRING}, max ${MAX_FILE_SIZE_STRING}`,
        });
      } else {
        this.setState({ error: null });
        this.props.onAdd(this.props.kind, withPreview(file));
      }
    }
  };

  render() {
    const { kind } = this.props;
    const { error } = this.state;
    if (kind === MediaKind.photo) {
      return (
        <Dz onDrop={this.onDrop} multiple={false}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} style={styles.dz}>
                <input {...getInputProps()} />
                <FontIcon
                  className="material-icons"
                  style={styles.icon}
                  color="#333333"
                >
                  add
                </FontIcon>
                <span>or drop</span> image here
                {!!error && <span style={styles.error}>{error}</span>}
              </div>
            );
          }}
        </Dz>
      );
    } else {
      return (
        <div style={styles.dz} onClick={this.onClick}>
          <FontIcon
            className="material-icons"
            style={styles.icon}
            color="#333333"
          >
            add
          </FontIcon>
          <span>add video</span>
          {!!error && <span style={styles.error}>{error}</span>}
        </div>
      );
    }
  }
}

export default Dropzone;
