import React, {Component, PropTypes} from 'react';
import MediaItem from './MediaItem';
import UploadedMediaItem from './UploadedMediaItem';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

const DEFAULT_MEDIA_ITEM = {url: '', type: 'photo', description: '', copyright: '', deleted: false, file: null};

export class MediaCollection extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.array,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      onChange: PropTypes.func,
    }),
  };

  render() {
    let {field: {value}} = this.props;
    value = value || [];
    return (
      <div style={styles.container}>
        {_.map(value, this.renderItem)}
        <div style={styles.footer}>
          <Dropzone style={styles.dropzone} onDrop={this.onDrop} accept="image/*" multiple={true} maxSize={1024 * 1024}>
            <FlatButton
              primary={true}
              style={styles.button}
              label="Upload photos"
              icon={<FontIcon className="material-icons">file_upload</FontIcon>}
            />
          </Dropzone>
          <span style={styles.separator}>or</span>
          <FlatButton
            onTouchTap={this.onAdd}
            primary={true}
            style={styles.button}
            label="Add external media"
            icon={<FontIcon className="material-icons">add</FontIcon>}
          />
        </div>
      </div>
    );
  }

  renderItem = (item, index) => {
    const value = _.assignWith({}, item, DEFAULT_MEDIA_ITEM, (itemValue, defValue, key) => itemValue || defValue);
    const Item = value.type === 'uploaded_image' ? UploadedMediaItem : MediaItem;
    return (
      <Item
        key={`item${index}`}
        value={value}
        error={_.get(this, `props.field.error.${index}`)}
        onChange={(value) => this.onChange(value, index)}
      />
    );
  };

  onAdd = () => {
    let {field: {value, onChange}} = this.props;
    value = value || [];
    onChange([...value, {...DEFAULT_MEDIA_ITEM}]);
  };

  onChange = (newItem, atIndex) => {
    let {field: {value, onChange}} = this.props;
    value = value.map((item, index) => index === atIndex ? {...item, ...newItem} : item);
    onChange(value);
  };

  onDrop = (acceptedFiles) => {
    const newMedia = acceptedFiles.map(file => ({...DEFAULT_MEDIA_ITEM, type: 'uploaded_image', description: file.name,  file}));
    let {field: {value = [], onChange}} = this.props;
    onChange([...value, ...newMedia]);
  };
}

const styles = {
  container: {
    backgroundColor: '#FAFAFA',
  },
  footer: {
    display: 'flex',
    marginLeft: 12,
    marginRight: 12,
    paddingBottom: 12,
  },
  separator: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropzone: {
    display: 'flex',
    flex: 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#c1c1c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {

    flex: 2,
  },
};