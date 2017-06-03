import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { get } from 'lodash';
import MediaPreviewButton from './MediaPreviewButton';

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
  col: {
    display: 'flex',
    flex: 1,
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
};

export default class UploadedMediaItem extends React.Component {
  static propTypes = {
    value: PropTypes.shape({
      url: PropTypes.string,
      description: PropTypes.string,
      copyright: PropTypes.string,
      deleted: PropTypes.boolean,
    }).isRequired,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: null,
  };

  onDescriptionChange = (event, description) => {
    this.props.onChange({ description });
  };

  onCopyrightChange = (event, copyright) => {
    this.props.onChange({ copyright });
  };

  onDelete = () => {
    this.props.onChange({ deleted: !this.props.value.deleted });
  };

  render() {
    const { error, value } = this.props;
    const delStyle = value.deleted ? styles.deleted : {};
    return (
      <div style={styles.container}>
        <div style={{ ...delStyle, ...styles.col }}>
          <div style={styles.row}>
            {value.file && <span>{`Original file: ${value.file.name}`}</span>}
            <TextField
              fullWidth
              errorText={get(error, 'description')}
              value={value.description}
              onChange={this.onDescriptionChange}
              hintText="Description"
            />
            <TextField
              fullWidth
              errorText={get(error, 'copyright')}
              value={value.copyright}
              onChange={this.onCopyrightChange}
              hintText="Copyright"
            />
          </div>
          <MediaPreviewButton value={value} />
        </div>
        <div style={styles.icon}>
          <IconButton iconClassName="material-icons" onTouchTap={this.onDelete}>
            {value.deleted ? 'undo' : 'clear'}
          </IconButton>
        </div>
      </div>
    );
  }
}
