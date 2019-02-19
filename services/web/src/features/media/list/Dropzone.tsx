import { MediaKind } from '@whitewater-guide/commons';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';
import Dz, { DropFilesEventHandler } from 'react-dropzone';
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
};

interface Props {
  kind: MediaKind;
  onAdd?: (kind: MediaKind, file?: FileWithPreview) => void;
}

class Dropzone extends React.PureComponent<Props> {
  onClick = () => {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.kind);
    }
  };

  onDrop: DropFilesEventHandler = (acceptedFiles) => {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.kind, withPreview(acceptedFiles[0]));
    }
  };

  render() {
    const { kind } = this.props;
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
        </div>
      );
    }
  }
}

export default Dropzone;
