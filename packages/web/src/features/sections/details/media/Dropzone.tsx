import FontIcon from 'material-ui/FontIcon';
import * as React from 'react';
import Dz, { DropFilesEventHandler } from 'react-dropzone';
import { Styles } from '../../../../styles';
import { MediaKind } from '../../../../ww-commons';
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
  onAdd?: (kind: MediaKind, file?: any) => void;
}

class Dropzone extends React.PureComponent<Props> {
  onClick = () => {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.kind);
    }
  };

  onDrop: DropFilesEventHandler = (acceptedFiles) => {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.kind);
    }
  };

  render() {
    const { kind } = this.props;
    if (kind === MediaKind.photo) {
      return (
        <Dz style={styles.dz} onDrop={this.onDrop}>
          <FontIcon className="material-icons" style={styles.icon} color="#333333">add</FontIcon>
          <span>or drop image here</span>
        </Dz>
      );
    } else {
      return (
        <div style={styles.dz} onClick={this.onClick}>
          <FontIcon className="material-icons" style={styles.icon} color="#333333">add</FontIcon>
          <span>add video</span>
        </div>
      );
    }
  }
}

export default Dropzone;
