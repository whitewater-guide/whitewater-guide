import React, { Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export const DEFAULT_MEDIA_ITEM = {url: '', type: 'photo', description: '', deleted: false};

class MediaItem extends Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      type: PropTypes.oneOfType(['photo','video','blog']),
      description: PropTypes.string,
    }),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
  };

  render() {
    let {error, value} = this.props;
    value = value || DEFAULT_MEDIA_ITEM;
    const delStyle = value.deleted ? styles.deleted : {};
    return (
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={{...styles.url, ...delStyle}}>
            <TextField
              style={styles.textInput}
              errorText={_.get(error, 'url')}
              value={value.url}
              onChange={this.onUrlChange}
              hintText="URL"
              floatingLabelText="URL"
            />
          </div>
          <div style={{...styles.type, ...delStyle}}>
            <SelectField
              style={styles.textInput}
              value={value.type}
              onChange={this.onTypeChange}
              errorText={_.get(error, 'type')}
              hintText="Type"
              floatingLabelText="Type"
            >
              <MenuItem value="photo" primaryText="Photo" />
              <MenuItem value="video" primaryText="Video" />
              <MenuItem value="blog" primaryText="Blog" />
            </SelectField>
          </div>
          <div style={styles.icon}>
            <IconButton iconClassName="material-icons" onTouchTap={this.onDelete}>
              {value.deleted ? 'undo' : 'clear'}
            </IconButton>
          </div>
        </div>
        <div style={delStyle}>
          <TextField
            style={styles.textInput}
            errorText={_.get(error, 'description')}
            value={value.description}
            onChange={this.onDescriptionChange}
            hintText="Description"
            floatingLabelText="Description"
            multiLine={true}
            rows={2}
            rowsMax={4}
          />
        </div>
      </div>
    )
  }

  onUrlChange = (event, value) => {
    this.props.onChange({...DEFAULT_MEDIA_ITEM, ...this.props.value, url: value});
  };

  onTypeChange = (event, index, value) => {
    this.props.onChange({...DEFAULT_MEDIA_ITEM, ...this.props.value, type: value});
  };

  onDescriptionChange = (event, value) => {
    this.props.onChange({...DEFAULT_MEDIA_ITEM, ...this.props.value, description: value});
  };

  onDelete = () => {
    const value = {...DEFAULT_MEDIA_ITEM, ...this.props.value};
    this.props.onChange({...value, deleted: !value.deleted});
  };
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  textInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
  },
  url: {
    display: 'flex',
    flex: 4,
  },
  type: {
    display: 'flex',
    flex: 1,
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
};

export default MediaItem;