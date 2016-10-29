import React, { Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import _ from 'lodash';

const defaultValue = {url: '', type: 'photo', description: ''};

class MediaItem extends Component {
  static propTypes = {
    url: PropTypes.string,
    type: PropTypes.oneOfType(['photo','video','blog']),
    description: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      onChange: PropTypes.func,
    }),
  };


  render() {
    let {error, value} = this.props.field;
    value = value || defaultValue;
    return (
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.url}>
            <TextField
              style={styles.textInput}
              errorText={_.get(error, 'url')}
              value={value.url}
              onChange={this.onUrlChange}
              hintText="URL"
              floatingLabelText="URL"
            />
          </div>
          <div style={styles.type}>
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
        </div>
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
    )
  }

  onUrlChange = (event, value) => {
    this.props.field.onChange({...defaultValue, ...this.props.field.value, url: value});
  };

  onTypeChange = (event, index, value) => {
    this.props.field.onChange({...defaultValue, ...this.props.field.value, type: value});
  };

  onDescriptionChange = (event, value) => {
    this.props.field.onChange({...defaultValue, ...this.props.field.value, description: value});
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
  }
};

export default MediaItem;