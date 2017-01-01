import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {TableRow, TableRowColumn} from 'material-ui/Table';

export default class ImageUploadRow extends Component {
  static propTypes = {
    onFileSelected: PropTypes.func,
  };

  render(){
    return (
      <TableRow>
        <TableRowColumn>
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
        </TableRowColumn>
      </TableRow>
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