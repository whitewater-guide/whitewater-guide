import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import Dropzone from 'react-dropzone';
import { Styles } from '../../styles';
import { FileWithPreview, withPreview } from '../../utils';

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
  onAdd: (file: FileWithPreview) => void;
}

class AddFile extends React.PureComponent<Props> {
  onDrop = (acceptedFiles: File[]) => {
    this.props.onAdd(withPreview(acceptedFiles[0]));
  };

  render() {
    return (
      <Dropzone onDrop={this.onDrop} multiple={false}>
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div {...getRootProps()} style={styles.dz}>
              <input {...getInputProps()} />
              <SvgIcon>
                <path
                  fill="#333333"
                  d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"
                />
              </SvgIcon>
            </div>
          );
        }}
      </Dropzone>
    );
  }
}

export default AddFile;
