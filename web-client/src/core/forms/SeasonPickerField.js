import React, { Component, PropTypes } from 'react';
import {SeasonPicker} from '../components';

export class SeasonPickerField extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    field: PropTypes.shape({
      value: PropTypes.any,
      error: PropTypes.string,
      onChange: PropTypes.func,
    }),
    type: PropTypes.string,
  };

  render() {
    const value = this.props.field.value === undefined ? [] : this.props.field.value;
    return (
      <SeasonPicker title={this.props.title} value={value} onChange={this.props.field.onChange}/>
    );
  }
}
