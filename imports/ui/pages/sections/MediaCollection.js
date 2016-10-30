import React, { Component, PropTypes } from 'react';
import MediaItem, {DEFAULT_MEDIA_ITEM} from './MediaItem';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

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
      <div style={styles.container}>
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
    return (
      <MediaItem
        key={`item${index}`}
        value={item}
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
    value = value.map((item, index) => index === atIndex ? newItem : item);
    onChange(value);
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 600,
    overflowY: 'auto',
  },
  buttonHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

export default MediaCollection;