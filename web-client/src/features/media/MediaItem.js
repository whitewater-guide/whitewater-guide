import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

class MediaItem extends Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      type: PropTypes.oneOf(['video','blog']),
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
        <div style={styles.row}>
          <div style={{...styles.url, ...delStyle}}>
            <TextField
              fullWidth={true}
              errorText={_.get(error, 'url')}
              value={value.url}
              onChange={this.onUrlChange}
              hintText="URL"
            />
          </div>
          <div style={{...styles.type, ...delStyle}}>
            <SelectField
              fullWidth={true}
              value={value.type}
              onChange={this.onTypeChange}
              errorText={_.get(error, 'type')}
              hintText="Type"
            >
              <MenuItem value="video" primaryText="External video" />
              <MenuItem value="blog" primaryText="External blog" />
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
      </div>
    )
  }

  onUrlChange = (event, value) => {
    this.props.onChange({url: value});
  };

  onTypeChange = (event, index, value) => {
    this.props.onChange({type: value});
  };

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
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e8e8e8',
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