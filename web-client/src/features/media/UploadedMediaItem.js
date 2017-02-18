import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export default class UploadedMediaItem extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      description: PropTypes.string,
      copyright: PropTypes.string,
    }),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
  };


  render() {
    let {error, value} = this.props;
    const delStyle = value.deleted ? styles.deleted : {};
    return (
      <div style={styles.container}>
        <div style={{...delStyle, ...styles.col}}>
          <div style={styles.row}>
            <TextField
              fullWidth={true}
              errorText={_.get(error, 'description')}
              value={value.description}
              onChange={this.onDescriptionChange}
              hintText="Description"
            />
            <TextField
              fullWidth={true}
              errorText={_.get(error, 'copyright')}
              value={value.copyright}
              onChange={this.onCopyrightChange}
              hintText="Copyright"
            />
          </div>
          <div style={styles.previewHolder}>
            { value.file && <img src={value.file.preview} style={styles.img}/> }
            {
              value.url &&
              <IconButton iconClassName="material-icons" onTouchTap={this.onPreview}>
                remove_red_eye
              </IconButton>
            }
          </div>
        </div>
        <div style={styles.icon}>
          <IconButton iconClassName="material-icons" onTouchTap={this.onDelete}>
            {value.deleted ? 'undo' : 'clear'}
          </IconButton>
        </div>
      </div>

    );
  }

  onDescriptionChange = (event, value) => {
    this.props.onChange({description: value});
  };

  onCopyrightChange = (event, value) => {
    this.props.onChange({copyright: value});
  };

  onDelete = () => {
    this.props.onChange({deleted: !this.props.value.deleted});
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e8e8e8',
  },
  deleted: {
    pointerEvents: 'none',
    opacity: 0.4,
  },
  icon: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewHolder: {
    width: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    display: 'flex',
    flex: 1,
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  img: {
    width: 64,
  }
};