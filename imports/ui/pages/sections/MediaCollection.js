import React, { Component, PropTypes } from 'react';
import MediaItem from './MediaItem';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

const DEFAULT_MEDIA_ITEM = {url: '', type: 'photo', description: '', copyright: '', deleted: false};

class MediaCollection extends Component {
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
      <div>
        {_.map(value, this.renderItem)}
        <div style={styles.buttonHolder}>
          <IconButton iconClassName="material-icons" onTouchTap={this.onAdd}>
            add
          </IconButton>
        </div>
      </div>
    );
  }

  renderItem = (item, index) => {
    const value = _.assignWith({}, item, DEFAULT_MEDIA_ITEM, (itemValue, defValue, key) => itemValue || defValue);
    return (
      <MediaItem
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
  }
}

const styles = {
  buttonHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

export default MediaCollection;