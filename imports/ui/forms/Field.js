import React, { Component, PropTypes, createElement } from 'react';

class Field extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.string,
    onChange: PropTypes.func,
    component: PropTypes.func,
  };

  render() {
    const {value, error, onChange, component, ...props} = this.props;
    const field = { value, error, onChange };
    return createElement(component, {...props, field});
  }
}

export default Field;