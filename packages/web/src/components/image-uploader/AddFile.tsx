import SvgIcon from 'material-ui/SvgIcon';
import React from 'react';
import Dropzone, { DropFilesEventHandler } from 'react-dropzone';
import { Styles } from '../../styles';

const styles: Styles = {
  dz: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  icon: {
    fontSize: 32,
  },
};

interface Props {
  onAdd: (file: File) => void;
}

class AddFile extends React.PureComponent<Props> {

  onDrop: DropFilesEventHandler = (acceptedFiles) => {
    this.props.onAdd(acceptedFiles[0]);
  };

  render() {
    return (
      <Dropzone style={styles.dz} onDrop={this.onDrop} multiple={false}>
        <SvgIcon color="#333333">
          <path fill="#000000" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
        </SvgIcon>
      </Dropzone>
    );
  }
}

export default AddFile;
