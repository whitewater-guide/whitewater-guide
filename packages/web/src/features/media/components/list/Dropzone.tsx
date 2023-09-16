import Icon from '@material-ui/core/Icon';
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_STRING,
  MIN_FILE_SIZE,
  MIN_FILE_SIZE_STRING,
} from '@whitewater-guide/commons';
import { MediaKind } from '@whitewater-guide/schema';
import React from 'react';
import Dz from 'react-dropzone';

import type { Styles } from '../../../../styles';
import type { LocalPhoto } from '../../../../utils/files';
import { toLocalPhoto } from '../../../../utils/files';
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
  onAdd?: (kind: MediaKind, photo?: LocalPhoto) => void;
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

  onDrop = async (acceptedFiles: File[]) => {
    if (this.props.onAdd) {
      const file = acceptedFiles[0];
      if (file.size <= MIN_FILE_SIZE || file.size >= MAX_FILE_SIZE) {
        this.setState({
          error: `Min ${MIN_FILE_SIZE_STRING}, max ${MAX_FILE_SIZE_STRING}`,
        });
      } else {
        this.setState({ error: null });
        const photo = await toLocalPhoto(file);
        this.props.onAdd(this.props.kind, photo);
      }
    }
  };

  render() {
    const { kind } = this.props;
    const { error } = this.state;
    if (kind === MediaKind.Photo) {
      return (
        <Dz onDrop={this.onDrop} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={styles.dz}>
              <input {...getInputProps()} />
              <Icon style={styles.icon}>add</Icon>
              <span>or drop</span> image here
              {!!error && <span style={styles.error}>{error}</span>}
            </div>
          )}
        </Dz>
      );
    }
    return (
      <div style={styles.dz} onClick={this.onClick}>
        <Icon style={styles.icon}>add</Icon>
        <span>add video</span>
        {!!error && <span style={styles.error}>{error}</span>}
      </div>
    );
  }
}

export default Dropzone;
