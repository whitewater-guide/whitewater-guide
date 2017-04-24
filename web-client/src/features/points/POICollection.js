import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {CoordinatesGroup} from './CoordinatesGroup';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export class POICollection extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.array,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      onChange: PropTypes.func,
    }),
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
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
    const innerField = {
      value: item,
      error: _.get(this, `props.field.error.${index}`),
      onChange: (value) => this.onChange(value, index),
    };
    return (
      <CoordinatesGroup
        mapBounds={this.props.bounds}
        key={`item${index}`}
        detailed={true}
        field={innerField}
      />
    );
  };

  onAdd = () => {
    let {field: {value, onChange}} = this.props;
    value = value || [];
    // onChange([...value, {...DEFAULT_MEDIA_ITEM}]);
    onChange([...value, {coordinates: null, altitude: undefined, kind: 'other', name: '', description: '' }]);
  };

  onChange = (newItem, atIndex) => {
    let {field: {value, onChange}} = this.props;
    value = value.map((item, index) => index === atIndex ? newItem : item);
    onChange(value);
  }
}

const styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
  },
  buttonHolder: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};