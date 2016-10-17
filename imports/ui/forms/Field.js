import React, { Component, PropTypes, createElement } from 'react';

class Field extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    component: PropTypes.func,
  };

  static contextTypes = {
    formData: PropTypes.object,
    formErrors: PropTypes.object,
    formFieldChangeHandler: PropTypes.func,
  };

  render() {
    const {component, ...props} = this.props;
    const value = this.context.formData[this.props.name];
    const error = this.context.formErrors[this.props.name];
    const onChange = (value) => this.context.formFieldChangeHandler(this.props.name, value);
    const field = { value, error, onChange };
    return createElement(component, {...props, field});
  }
}

export default Field;