import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

export default class ImageUploadRow extends Component {
  static propTypes = {
    onFileSelected: PropTypes.func,
  };

  render(){
    return (
      <div style={styles.container}>
        <TextField hintText="Image description" fullWidth={true}/>
        <RaisedButton
          label="Upload"
          primary={true}
          icon={<FontIcon className="material-icons">file_upload</FontIcon>}
          style={styles.uploadButton}
        >
          <input type="file" style={styles.imageInput} onChange={this.onFileChange}/>
        </RaisedButton>
      </div>
    );
  }

  onFileChange = ({nativeEvent}) => {
    this.props.onFileSelected(nativeEvent.target.files[0]);
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingLeft: 16,
  },
  uploadButton: {
    margin: 8,
  },
  imageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};